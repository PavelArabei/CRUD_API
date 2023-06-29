// import type * as TestFunctions from '../src/index'
//
// const { sum } = jest.requireActual<typeof TestFunctions>('../src/index')
//
// const successCases = [
//   {
//     id: 0,
//     input: { a: 1, b: 1 },
//     output: 2,
//   },
//   {
//     id: 1,
//     input: { a: 2, b: 3 },
//     output: 5,
//   },
//   {
//     id: 2,
//     input: { a: 2, b: 8 },
//     output: 10,
//   },
//   {
//     id: 3,
//     input: { a: 4, b: 5 },
//     output: 9,
//   },
// ]
//
// describe('Test sum function', () => {
//   it.each(successCases)('success case $id', ({ input, output }) => {
//     const { a, b } = input
//     expect(sum(a, b)).toBe(output)
//   })
// })
