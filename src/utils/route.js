import { faker } from "@faker-js/faker"

export const createRoute = () => {
  return faker.string.uuid()
}

export const createRoutes = (length) => {
  const arr = new Array(length)
  for (let i = 0; i < arr.length; i++) {
    arr[i] = createRoute()
  }
  return arr
}

const defaultInitializer = (index) => index

export function createRange(length, initializer = defaultInitializer) {
  return [...new Array(length)].map((_, index) => initializer(index))
}
