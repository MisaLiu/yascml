
export interface Middleware<C extends object> {
  (context: C, next: () => void): void;
  (context: C): void;
}

/**
 * An express-like middleware.
 */
export class OnionModel<C extends object> {
  private middlewares: Middleware<C>[] = [];

  /**
   * Add a middleware to current hook.
   * 
   * ```js
   * middleware.hook(async (context, next) => {
   *   if (!isMatchedSource(context.source)) return next();
   *   const replacedSource = await sourceReplacer(context.source);
   *   context.source = replacedSource;
   * });
   * ```
   * 
   * @param {Middleware} middleware - New middleware
   */
  hook(middleware: Middleware<C>) {
    this.middlewares.push(middleware);
  }

  /**
   * Remove a middleware from current hook.
   * 
   * @param {Middleware} middleware - Added middleware
   */
  unhook(middleware: Middleware<C>) {
    const index = this.middlewares.findIndex(e => e === middleware);
    if (index === -1) return;
    this.middlewares.splice(index, 1);
  }

  /**
   * Waking through current hook with given context. This should not be called manually.
   * 
   * @param context 
   * @returns {Promise<void>}
   */
  async run(context: C): Promise<void> {
    const dispatch = (i: number) => {
      if (i >= this.middlewares.length) return;
      const middleware = this.middlewares[i];
      return Promise.resolve(middleware(context, () => dispatch(i + 1)));
    };
    return dispatch(0);
  }
}
