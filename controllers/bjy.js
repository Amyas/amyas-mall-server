'use strict';
const partnerKey = '7bfGEPObAEUaq70IMVkIp+vxdiK6iYMsHCqc83U3lzIRO0wHPmolhflLJQ8El7T2ZavkqVcc3goxA9Ruz3BTRQEmFEpO';

function getSign(params, partner_key = partnerKey) {
  const data = {};

  Object.keys(params).sort().forEach(key => (data[key] = params[key]));

  let str = Object.keys(data).map(key => `${key}=${data[key]}`).join('&');

  str += `&partner_key=${partner_key}`;

  return require('crypto').createHash('md5').update(str)
    .digest('hex');
}

const sign = getSign({
  room_id: '20090771271070',
  user_number: 10001851,
  user_name: 'Amyas',
  user_role: 0,
  user_avatar: '',
});


console.log(sign);

// exports.test = async ctx => {
//   console.log(ctx.query, '@@@');
//   ctx.body = ctx.query;
// };
