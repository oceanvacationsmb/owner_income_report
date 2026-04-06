const fs = require("fs");

const data = JSON.parse(fs.readFileSync("/private/tmp/target-codes-scan.json", "utf8"));
const rows = (data.nmb304bMarch || []).map((x) => x.row);

function pickNumber(...values) {
  for (const value of values) {
    if (value == null || value === "") continue;
    if (typeof value === "number" && Number.isFinite(value)) return value;
    const n = Number(String(value).replace(/[$,]/g, "").trim());
    if (Number.isFinite(n)) return n;
  }
  return 0;
}

function pickText(...values) {
  for (const value of values) {
    if (value == null) continue;
    if (typeof value === "string") {
      const t = value.trim();
      if (t) return t;
      continue;
    }
    if (typeof value === "object") {
      const candidates = [value.children, value.value, value.label, value.name, value.text];
      for (const c of candidates) {
        if (c == null) continue;
        const t = String(c).trim();
        if (t) return t;
      }
    }
    const t = String(value).trim();
    if (t && t !== "[object Object]") return t;
  }
  return "";
}

function normalizeCode(rawCode) {
  return String(rawCode || "").toUpperCase();
}

function buildForRow(r) {
  const codeRaw = pickText(r["confirmationCode"], r.confirmationCode, r.code, r.reservationCode);
  const code = normalizeCode(codeRaw);

  const listing = pickText(r["listing.nickname"], r.listing?.nickname, r.listingName);
  const gross = Math.max(0, pickNumber(
    r["money.hostPayout"]?.value,
    r.money?.hostPayout?.value,
    r["preCancelationMoney.hostPayout"]?.value,
    r.preCancelationMoney?.hostPayout?.value,
    r["money.payout"]?.value,
    r.money?.payout?.value,
    r["money.totalPayout"]?.value,
    r.money?.totalPayout?.value,
    r.hostPayout,
    r.totalPayout,
    r.payout
  ));

  const cleaningRaw = pickNumber(
    r["money.fareCleaning"]?.value,
    r.money?.fareCleaning?.value,
    r["money.invoiceItems.CLEANING_FEE"]?.value,
    r["money.invoiceItems.CLEANING"]?.value,
    r["money.invoiceItems.CLF"]?.value,
    r.money?.invoiceItems?.CLEANING_FEE?.value,
    r.money?.invoiceItems?.CLEANING?.value,
    r.money?.invoiceItems?.CLF?.value,
    r.fareCleaning,
    r.cleaningFee
  );

  const statusValue = String(pickText(r.status, r.reservationStatus, r["STATUS"], r["reservationStatus"]) || "").toLowerCase();
  const isCancelledStatus = statusValue === "cancel" || statusValue === "cancelled" || statusValue === "canceled";
  const hasPayout = gross > 0;
  const effectiveCleaningFare = (isCancelledStatus && hasPayout) ? 0 : cleaningRaw;

  const caps = { "NMB - 304B": 500 };
  const maxCleaningCap = caps[listing] ?? 500;
  const draftCleaningFare = Math.min(maxCleaningCap, Math.max(0, effectiveCleaningFare));

  const taxes = pickNumber(r["money.fareTaxes"]?.value, r.money?.fareTaxes?.value, r.fareTaxes, r.taxes, r.tax);

  const cityTax = pickNumber(r["money.invoiceItems.CITY_TAX"]?.value, r.money?.invoiceItems?.CITY_TAX?.value);
  const stateTax = pickNumber(r["money.invoiceItems.STATE_TAX"]?.value, r.money?.invoiceItems?.STATE_TAX?.value);
  const countyTaxItem = pickNumber(r["money.invoiceItems.COUNTY_TAX"]?.value, r.money?.invoiceItems?.COUNTY_TAX?.value);
  const occupancyTaxItem = pickNumber(r["money.invoiceItems.OCCUPANCY_TAX"]?.value, r.money?.invoiceItems?.OCCUPANCY_TAX?.value);
  const countyTax = pickNumber(r["taxCounty"]?.value, r.taxCounty?.value, r.taxCounty);
  const occupancyTax = pickNumber(r["taxOccupancy"]?.value, r.taxOccupancy?.value, r.taxOccupancy);
  const gtcTax = pickNumber(r["money.invoiceItems.GTC_TAX"]?.value, r.money?.invoiceItems?.GTC_TAX?.value);

  const detailedTaxesCombined = cityTax + stateTax + countyTaxItem + occupancyTaxItem + countyTax + occupancyTax;
  const allTaxesCombined = Math.max(0, taxes, detailedTaxesCombined);

  const lengthDiscount = pickNumber(
    r["money.invoiceItems.LOS"]?.value,
    r["money.invoiceItems.lengthOfStayDiscount"]?.value,
    r.money?.invoiceItems?.LOS?.value,
    r.money?.invoiceItems?.lengthOfStayDiscount?.value,
    r.lengthOfStayDiscount
  );

  const sourceValue = pickText(r.source, r["source"], r["integration.source"], r.integration?.source, r.channel, r["channel"]);
  const platformUpper = String(pickText(r["integration.platform"], r.platform, r.integration?.platform) || "").toUpperCase().trim();
  const sourceUpper = String(sourceValue || "").toUpperCase().trim();

  const isManualVrbo = sourceUpper.includes("MANUAL_VRBO") || sourceUpper.includes("VRBO_MANUAL");
  const isManualDirect = sourceUpper.includes("MANUAL_DIRECT");
  const isVrboDirect = sourceUpper.includes("VRBO_DIRECT") || sourceUpper.includes("DIRECT_VRBO");
  const isAirbnb = platformUpper.includes("AIRBNB") || sourceUpper.includes("AIRBNB2") || sourceUpper.includes("AIRBNB");
  const isVrboOrHomeAway = (platformUpper.includes("VRBO") || platformUpper.includes("HOMEAWAY") || sourceUpper.includes("VRBO") || sourceUpper.includes("HOMEAWAY")) && !isManualVrbo;
  const isWebsite = sourceUpper.includes("WEBSITE");
  const isDirect = sourceUpper.includes("DIRECT");

  const hostServiceFee = pickNumber(r["money.hostServiceFee"]?.value, r.money?.hostServiceFee?.value, r["money.hostServiceFee"], r.hostServiceFee);
  const feeCreditCard = pickNumber(r["feeCreditCard"]?.value, r.feeCreditCard?.value, r["money.invoiceItems.feeCreditCard"]?.value, r.money?.invoiceItems?.feeCreditCard?.value, r.feeCreditCard);

  const isDraftChannelCommissionEligible = (isVrboOrHomeAway || isWebsite || isDirect) && !isManualDirect && !isVrboDirect && !isAirbnb;

  let vrboWebsiteFee = 0;
  if (isDraftChannelCommissionEligible) {
    if (isWebsite) {
      vrboWebsiteFee = Math.max(0, (gross * 0.01) + 0.30);
    } else {
      vrboWebsiteFee = Math.max(0, hostServiceFee);
    }
  }

  const airbnbResolutionCenter = pickNumber(
    r["money.invoiceItems.ARC"]?.value,
    r["money.invoiceItems.Arc"]?.value,
    r.money?.invoiceItems?.ARC?.value,
    r.money?.invoiceItems?.Arc?.value,
    r["money.invoiceItems.ARC"]?.amount,
    r["money.invoiceItems.Arc"]?.amount,
    r.airbnbResolutionCenter,
    r.resolutionCenter
  );

  const net = Math.max(0, gross - Math.max(0, draftCleaningFare) - Math.max(0, allTaxesCombined) + Math.max(0, lengthDiscount) - Math.max(0, vrboWebsiteFee) - Math.max(0, feeCreditCard) - Math.max(0, airbnbResolutionCenter));

  return {
    code,
    listing,
    checkIn: pickText(r["checkInDate"], r.checkInDate, r.checkIn),
    rawSourceFields: {
      totalPayout: r["money.hostPayout"]?.value ?? null,
      cleaningFare: r["money.fareCleaning"]?.value ?? null,
      draftCleaningFare: null,
      taxes: r["money.fareTaxes"]?.value ?? null,
      cityTax: r["money.invoiceItems.CITY_TAX"]?.value ?? null,
      stateTax: r["money.invoiceItems.STATE_TAX"]?.value ?? null,
      countyTax: r["money.invoiceItems.COUNTY_TAX"]?.value ?? r["taxCounty"]?.value ?? null,
      occupancyTax: r["money.invoiceItems.OCCUPANCY_TAX"]?.value ?? r["taxOccupancy"]?.value ?? null,
      gtcTax: r["money.invoiceItems.GTC_TAX"]?.value ?? null,
      lengthDiscount: r["lengthOfStayDiscount"]?.value ?? r["money.invoiceItems.LOS"]?.value ?? null,
      channelCommission: r["money.hostServiceFee"]?.value ?? null,
      feeCreditCard: r["feeCreditCard"]?.value ?? null,
      airbnbResolutionCenter: r["money.invoiceItems.Arc"]?.value ?? r["money.invoiceItems.ARC"]?.value ?? null,
      netAccommodation: r["NET ACCOMMODATION"]?.value ?? null
    },
    normalizedValuesUsed: {
      gross,
      cleaning: draftCleaningFare,
      taxes,
      cityTax,
      stateTax,
      countyTax,
      occupancyTax,
      gtcTax,
      detailedTaxesCombined,
      allTaxesCombined,
      lengthDiscount,
      vrboWebsiteFee,
      feeCreditCard,
      airbnbResolutionCenter,
      netAccommodationInSource: pickNumber(r["NET ACCOMMODATION"]?.value, r["netAccommodation"]?.value)
    },
    formula: {
      expression: "net = max(0, gross - cleaning - taxes + lengthDiscount - vrboWebsiteFee - feeCreditCard - airbnbResolutionCenter)",
      components: {
        gross,
        cleaning: draftCleaningFare,
        taxes: allTaxesCombined,
        lengthDiscount,
        vrboWebsiteFee,
        feeCreditCard,
        airbnbResolutionCenter
      },
      result: net
    }
  };
}

const targetCodes = ["HMQ4SPTED3", "HA-QPH3JMF"];
const byCode = {};
for (const row of rows) {
  const built = buildForRow(row);
  byCode[built.code] = built;
}

const reservationBreakdown = targetCodes.map((c) => byCode[c] || { code: c, missing: true });
const propertyNet = reservationBreakdown.reduce((s, x) => s + (x.formula?.result || 0), 0);

const out = {
  reservationBreakdown,
  propertyTotal: {
    property: "NMB - 304B",
    month: "2026-03",
    codes: reservationBreakdown.map((x) => x.code),
    netAccommodationSum: propertyNet
  }
};

fs.writeFileSync("/private/tmp/evidence-calculated.json", JSON.stringify(out, null, 2));
console.log("WROTE /private/tmp/evidence-calculated.json");
