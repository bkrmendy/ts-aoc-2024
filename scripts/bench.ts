// import * as Day1 from '../src/01/01'
// import Day1Example from '../src/01/example.txt'
// import * as Day2 from '../src/02/02'
// import Day2Example from '../src/02/example.txt'
// import * as Day3 from '../src/03/03'
// import Day3Example from '../src/03/example.txt'
// import * as Day5 from '../src/05/05'
// import Day5Example from '../src/05/example.txt'

import { formatPerformance, withPerformance } from './utils'

const days: Array<[any, (_: any) => any, (_: any) => any]> = [
  // [Day1.parse(Day1Example), Day1.partOne, Day1.partTwo],
  // [Day2.parse(Day2Example), Day2.partOne, Day2.partTwo],
  // [Day3.parse(Day3Example), Day3.partOne, Day3.partTwo],
  // [Day5.parse(Day5Example), Day5.partOne, Day5.partTwo]
]

const [_, performance] = withPerformance(() => {
  for (const [input, partOne, partTwo] of days) {
    console.log('Part One:', partOne(input))
    console.log('Part Two:', partTwo(input))
  }
})

console.log(formatPerformance(performance))
