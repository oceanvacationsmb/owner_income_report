I'll update your `renderReservationsTable()` to hide the main combined table and the calendar when more than one property is present — leaving everything else unchanged. Replace your existing `renderReservationsTable` function with the version below.

Updated function (replace the whole function in your JS file):

```javascript
function renderReservationsTable() {
  const tbody = document.getElementById("reservationsBody");
  if (!tbody) return;
  tbody.innerHTML = "";

  const sortedReservations = [...reservationsData].sort((a, b) => {
    return toSortableDate(a.checkIn) - toSortableDate(b.checkIn);
  });

  // Build property groups up front so we can decide whether to keep the main table/calendar
  const propertyGroups = {};
  sortedReservations.forEach(reservation => {
    const propertyKey = (reservation.listingNickname || "Unknown Property").trim();
    if (!propertyGroups[propertyKey]) propertyGroups[propertyKey] = [];
    propertyGroups[propertyKey].push(reservation);
  });
  const propertyNames = Object.keys(propertyGroups);

  // If more than one property: remove the main combined reservations table and remove/hide calendar
  if (propertyNames.length > 1) {
    const mainTable = tbody.closest("table");
    if (mainTable && mainTable.parentNode) {
      mainTable.parentNode.removeChild(mainTable);
    } else {
      tbody.innerHTML = "";
    }

    const calendarPanel = document.getElementById("calendarPanel");
    if (calendarPanel && calendarPanel.parentNode) {
      calendarPanel.parentNode.removeChild(calendarPanel);
    } else if (calendarPanel) {
      calendarPanel.style.display = "none";
    }
  } else {
    // Single-property behaviour: render the main reservations table as before
    if (!sortedReservations.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="9" style="text-align:center;">No reservations found</td>
        </tr>
      `;
    } else {
      sortedReservations.forEach(reservation => {
        const accommodation = toNumber(reservation.accommodationFare);
        const pmc = accommodation * (currentOwner.pmcPercent / 100);
        const ownerPayout = accommodation - pmc;
        const expectedPayoutDate = getExpectedPayoutDate(reservation.checkOut);
        const nights = toNumber(reservation.numberOfNights);

        tbody.innerHTML += `
          <tr>
            <td>${reservation.confirmationCode || ""}</td>
            <td style="text-align:center;">${reservation.platform || ""}</td>
            <td style="text-align:center;">${formatDateDisplay(reservation.checkIn) || ""}</td>
            <td style="text-align:center;">${formatDateDisplay(reservation.checkOut) || ""}</td>
            <td style="text-align:center;">${nights}</td>
            <td style="text-align:center;">${formatMoney(accommodation)}</td>
            <td style="text-align:center;">${formatMoney(pmc)}</td>
            <td style="text-align:center;">${formatMoney(ownerPayout)}</td>
            <td style="text-align:center;">${expectedPayoutDate}</td>
          </tr>
        `;
      });
    }
  }

  // --- the rest of the function remains unchanged ---
  let oldOwnerTable = document.getElementById("ownerStaysTable");
  if (oldOwnerTable && oldOwnerTable.parentNode) {
    oldOwnerTable.parentNode.removeChild(oldOwnerTable);
  }

  let oldVrboManualTable = document.getElementById("vrboManualTable");
  if (oldVrboManualTable && oldVrboManualTable.parentNode) {
    oldVrboManualTable.parentNode.removeChild(oldVrboManualTable);
  }

  // propertyGroups was already built above; reuse propertyGroups/propertyNames here
  if (propertyNames.length > 1) {
    const tableWraps = document.getElementsByClassName("table-wrap");
    let container = null;

    if (tableWraps.length > 0) {
      container = tableWraps[0].parentNode;
    } else {
      container = document.body;
    }

    const propertyWrap = document.createElement("div");
    propertyWrap.id = "propertyGroupsWrap";

    propertyNames.forEach(propertyName => {
      const rows = propertyGroups[propertyName].sort((a, b) => {
        return toSortableDate(a.checkIn) - toSortableDate(b.checkIn);
      });

      let propertyAccommodation = 0;
      let propertyPmc = 0;
      let propertyOwnerPayout = 0;

      rows.forEach(reservation => {
        const accommodation = toNumber(reservation.accommodationFare);
        const pmc = accommodation * (currentOwner.pmcPercent / 100);
        const ownerPayout = accommodation - pmc;
        propertyAccommodation += accommodation;
        propertyPmc += pmc;
        propertyOwnerPayout += ownerPayout;
      });

      propertyWrap.innerHTML += `
        <div style="margin-top:40px;">
          <h3 class="section-title" style="text-align:center; margin-bottom:12px;">${propertyName}</h3>

          <div style="display:flex; justify-content:center; gap:18px; flex-wrap:wrap; margin-bottom:14px;">
            <div class="summary-box">
              <div class="summary-label">Accommodation</div>
              <div class="summary-value">${formatMoney(propertyAccommodation)}</div>
            </div>
            <div class="summary-box">
              <div class="summary-label">PMC</div>
              <div class="summary-value">${formatMoney(propertyPmc)}</div>
            </div>
            <div class="summary-box">
              <div class="summary-label">Owner Payout</div>
              <div class="summary-value">${formatMoney(propertyOwnerPayout)}</div>
            </div>
          </div>

          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th style="text-align:center;">Code</th>
                  <th style="text-align:center;">Platform</th>
                  <th style="text-align:center;">Check In</th>
                  <th style="text-align:center;">Check Out</th>
                  <th style="text-align:center;">Nights</th>
                  <th style="text-align:center;">Accommodation</th>
                  <th style="text-align:center;">PMC</th>
                  <th style="text-align:center;">Owner Payout</th>
                  <th style="text-align:center;">Expected Payout</th>
                </tr>
              </thead>
              <tbody>
                ${rows.map(reservation => {
                  const accommodation = toNumber(reservation.accommodationFare);
                  const pmc = accommodation * (currentOwner.pmcPercent / 100);
                  const ownerPayout = accommodation - pmc;
                  const expectedPayoutDate = getExpectedPayoutDate(reservation.checkOut);
                  const nights = toNumber(reservation.numberOfNights);

                  return `
                    <tr>
                      <td>${reservation.confirmationCode || ""}</td>
                      <td style="text-align:center;">${reservation.platform || ""}</td>
                      <td style="text-align:center;">${formatDateDisplay(reservation.checkIn) || ""}</td>
                      <td style="text-align:center;">${formatDateDisplay(reservation.checkOut) || ""}</td>
                      <td style="text-align:center;">${nights}</td>
                      <td style="text-align:center;">${formatMoney(accommodation)}</td>
                      <td style="text-align:center;">${formatMoney(pmc)}</td>
                      <td style="text-align:center;">${formatMoney(ownerPayout)}</td>
                      <td style="text-align:center;">${expectedPayoutDate}</td>
                    </tr>
                  `;
                }).join("")}
              </tbody>
            </table>
          </div>
        </div>
      `;
    });

    container.appendChild(propertyWrap);
  }

  // The remaining VRBO and owner-stays sections follow exactly as before in your file.
}
```

Want me to apply this change directly to your file? If so, tell me the file path where this JavaScript lives and I’ll patch it.
