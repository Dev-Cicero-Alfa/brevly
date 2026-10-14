/**
 * Either: representa um valor que pode ser uma falha (Left) ou um sucesso (Right).
 * Abordagem funcional de tratamento de erros, sem lançar exceções nas regras de negócio.
 */

export type Left<L> = { left: L; right?: never }
export type Right<R> = { left?: never; right: R }
export type Either<L, R> = NonNullable<Left<L> | Right<R>>

export function makeLeft<L>(value: L): Left<L> {
  return { left: value }
}

export function makeRight<R>(value: R): Right<R> {
  return { right: value }
}

export function isLeft<L, R>(e: Either<L, R>): e is Left<L> {
  return e.left !== undefined
}

export function isRight<L, R>(e: Either<L, R>): e is Right<R> {
  return e.right !== undefined
}

type UnwrapEither = <T extends Either<unknown, unknown>>(
  e: T
) => NonNullable<T['left'] | T['right']>

export const unwrapEither: UnwrapEither = <T extends Either<unknown, unknown>>({ left, right }: T) => {
  if (right !== undefined && left !== undefined) {
    throw new Error(`Received both left and right values at runtime when opening an Either\nLeft: ${JSON.stringify(left)}\nRight: ${JSON.stringify(right)}`)
  }
  if (left !== undefined) {
    return left as NonNullable<T['left']>
  }
  if (right !== undefined) {
    return right as NonNullable<T['right']>
  }
  throw new Error('Received no left or right values at runtime when opening Either')
}
