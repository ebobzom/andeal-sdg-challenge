/* eslint linebreak-style: off */
function normalizePeriod(periodType, timeToElapse) {
  if (periodType.toLowerCase() === 'days') return timeToElapse;

  if (periodType.toLowerCase() === 'weeks') return parseInt(timeToElapse * 7, 10);

  if (periodType.toLowerCase() === 'months') return parseInt(timeToElapse * 30, 10);

  if (periodType.toLowerCase() === 'years') return parseInt(timeToElapse * 30 * 365, 10);

  return null;
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

  return {
    data,
    impact,
    severeImpact
  };
};

export default covid19ImpactEstimator;
