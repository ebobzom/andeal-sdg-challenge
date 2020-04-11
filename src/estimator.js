/* eslint linebreak-style: off */

// const data1 = {
//   region: {
//     name: 'Africa',
//     avgAge: 19.7,
//     avgDailyIncomeInUSD: 6,
//     avgDailyIncomePopulation: 0.55
//   },
//   reportedCases: 2883,
//   population: 103463004,
//   totalHospitalBeds: 2272236,
//   timeToElapse: 27,
//   periodType: 'days'
// };

// const data2 = {
//   region: {
//     name: 'Africa',
//     avgAge: 19.7,
//     avgDailyIncomeInUSD: 6,
//     avgDailyIncomePopulation: 0.72
//   },
//   reportedCases: 1382,
//   population: 88712629,
//   totalHospitalBeds: 1725402,
//   timeToElapse: 1,
//   periodType: 'weeks'
// };

// const data3 = {
//   region: {
//     name: 'Africa',
//     avgAge: 19.7,
//     avgDailyIncomeInUSD: 3,
//     avgDailyIncomePopulation: 0.57
//   },
//   reportedCases: 1790,
//   population: 156590279,
//   totalHospitalBeds: 2487868,
//   timeToElapse: 5,
//   periodType: 'months'
// };

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
  /* eslint no-console:off */
  // console.log(data);
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
  impact.hospitalBedsByRequestedTime = parseInt(hospitalBedsAvailable(
    data.totalHospitalBeds, impact.severeCasesByRequestedTime
  ), 10);
  severeImpact.hospitalBedsByRequestedTime = parseInt(hospitalBedsAvailable(
    data.totalHospitalBeds, severeImpact.severeCasesByRequestedTime
  ), 10);
  impact.casesForICUByRequestedTime = impact.infectionsByRequestedTime * 0.05;
  severeImpact.casesForICUByRequestedTime = severeImpact.infectionsByRequestedTime * 0.05;
  impact.casesForVentilatorsByRequestedTime = parseInt(impact.infectionsByRequestedTime * 0.02, 10);
  severeImpact.casesForVentilatorsByRequestedTime = parseInt(
    severeImpact.infectionsByRequestedTime * 0.02, 10
  );
  impact.dollarsInFlight = parseInt((impact.infectionsByRequestedTime
    * data.region.avgDailyIncomeInUSD * data.region.avgDailyIncomePopulation) / normalizePeriod(
    data.periodType, data.timeToElapse
  ), 10);
  severeImpact.dollarsInFlight = parseInt((severeImpact.infectionsByRequestedTime
  * data.region.avgDailyIncomeInUSD * data.region.avgDailyIncomePopulation) / normalizePeriod(
    data.periodType, data.timeToElapse
  ), 10);

  return {
    data,
    impact,
    severeImpact
  };
};

// console.log(covid19ImpactEstimator(data1));
// console.log(covid19ImpactEstimator(data2));
// console.log(covid19ImpactEstimator(data3));

export default covid19ImpactEstimator;
