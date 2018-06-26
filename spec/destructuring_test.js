const {func} = require('../src');

const contacts = [{
    name: {
      first: 'Ajay',
    },
    last: 'Gandhi',
  },
  {
    name: {
      first: 'Seunghee',
      last: 'Han',
    },
  },
  {
    name: 'Evil Galactic Empire, Inc.',
    kind: 'company',
  },
];

const first_company = func(([{kind = 'company', name}, ..._]) => name)
const first_contact = func(([{name: {first}}, ..._]) => first);

test('no company', () => {
  expect(first_company(contacts)).toBe(undefined);
});

test('first contact', () => {
  expect(first_contact(contacts)).toBe('Ajay');
});
