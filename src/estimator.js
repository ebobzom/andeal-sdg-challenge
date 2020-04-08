/* eslint linebreak-style: off */
function normalizePeriod(periodType, timeToElapse) {
  if (periodType.toLowerCase() === 'days') return timeToElapse;

  if (periodType.toLowerCase() === 'weeks') return timeToElapse * 7;

  if (periodType.toLowerCase() === 'months') return timeToElapse * 30;

  if (periodType.toLowerCase() === 'years') return timeToElapse * 30 * 365;

  return null;
}

function hospitalBedsAvailable(totalHospitalBeds, severeCasesByRequestedTime) {
  const availableBed = 0.35 * totalHospitalBeds;
  return availableBed - severeCasesByRequestedTime;
}

const covid19ImpactEstimator = (data) => {
  const impact = {};
  const severeImpact = {};
  const normalizedTime = normalizePeriod(data.periodType, data.timeToElapse);
  const power = parseInt(normalizedTime / 3, 10);

  impact.currentlyInfected = data.reportedCases * 10;
  severeImpact.currentlyInfected = data.reportedCases * 50;
  impact.infectionsByRequestedTime = impact.currentlyInfected * (2 ** power);
  severeImpact.infectionsByRequestedTime = severeImpact.currentlyInfected * (2 ** power);
  impact.severeCasesByRequestedTime = impact.infectionsByRequestedTime * 0.15;
  severeImpact.severeCasesByRequestedTime = severeImpact.infectionsByRequestedTime * 0.15;
  impact.hospitalBedsByRequestedTime = hospitalBedsAvailable(
    data.totalHospitalBeds, impact.severeCasesByRequestedTime
  );
  severeImpact.hospitalBedsByRequestedTime = hospitalBedsAvailable(
    data.totalHospitalBeds, severeImpact.severeCasesByRequestedTime
  );
  impact.casesForICUByRequestedTime = impact.infectionsByRequestedTime * 0.05;
  severeImpact.casesForICUByRequestedTime = severeImpact.infectionsByRequestedTime * 0.05;
  impact.casesForVentilatorsByRequestedTime = impact.infectionsByRequestedTime * 0.02;
  severeImpact.casesForVentilatorsByRequestedTime = severeImpact.infectionsByRequestedTime * 0.02;
  impact.dollarsInFlight = (impact.infectionsByRequestedTime
  * normalizePeriod(data.periodType, data.timeToElapse)
  * data.region.avgDailyIncomeInUSD * data.region.avgDailyIncomePopulation).toFixed(2);

  severeImpact.dollarsInFlight = (severeImpact.infectionsByRequestedTime
  * normalizePeriod(data.periodType, data.timeToElapse)
  * data.region.avgDailyIncomeInUSD * data.region.avgDailyIncomePopulation).toFixed(2);

  return {
    data,
    impact,
    severeImpact
  };
};

export default covid19ImpactEstimator;
