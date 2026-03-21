function renderReservationsTable() {
  const tbody = document.getElementById("reservationsBody");
  if (!tbody) return;
  tbody.innerHTML = "";

  // Main reservations
  if (!reservationsData.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align:center;">No reservations found</td>
      </tr>
    `;
    // Continue, do not return, so owner stays still render below if needed
  }
  reservationsData.forEach(reservation => {
    const accommodation = toNumber(reservation.accommodationFare);
    const pmc = accommodation * (currentOwner.pmcPercent / 100);
    const ownerPayout = accommodation - pmc;
    const expectedPayoutDate = getExpectedPayoutDate(reservation.checkOut);
    tbody.innerHTML += `
      <tr>
        <td>${reservation.confirmationCode || ""}</td>
        <td>${reservation.platform || ""}</td>
        <td>${formatDateDisplay(reservation.checkIn) || ""}</td>
        <td>${formatDateDisplay(reservation.checkOut) || ""}</td>
        <td>${formatMoney(accommodation)}</td>
        <td>${formatMoney(pmc)}</td>
        <td>${formatMoney(ownerPayout)}</td>
        <td>${expectedPayoutDate}</td>
      </tr>
    `;
  });

  // --- Inline Owner Stays Section directly below main table rows ---
  if (ownerStaysData.length) {
    tbody.innerHTML += `
      <tr>
        <td colspan="8" style="padding-top:32px;padding-bottom:0;">
          <h2 style="margin:0 0 8px 0;text-align:left;">Upcoming Owner Stays</h2>
          <table style="width:100%;background:#f8fcff;">
            <thead>
              <tr>
                <th>Check-In</th>
                <th>Check-Out</th>
                <th>Cleaning Fee</th>
              </tr>
            </thead>
            <tbody>
              ${ownerStaysData.map(res => `
                <tr>
                  <td>${formatDateDisplay(res.checkIn || res.checkInDate || "")}</td>
                  <td>${formatDateDisplay(res.checkOut || res.checkOutDate || "")}</td>
                  <td>${formatMoney(getCleaningFee())}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </td>
      </tr>
    `;
  }
}
