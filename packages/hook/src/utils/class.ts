
export interface Middleware<C extends object> {
  (context: C, next: () => void): void;
  (context: C): void;
}

export interface MiddlewareAsync<C extends object> extends Middleware<C> {
  (context: C, next: () => void): Promise<void>;
  (context: C): Promise<void>;
}

/**
 * An express-like middleware.
 */
export class OnionModel<C extends object> {
  protected readonly middlewares: Middleware<C>[] = [];

  /**
   * Add a middleware to current hook.
   * 
   * ```js
   * middleware.hook((context, next) => {
   *   if (!isMatchedSource(context.source)) return next();
   *   const replacedSource = sourceReplacer(context.source);
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
   * @returns {void}
   */
  run(context: C): void {
    const dispatch = (i: number) => {
      if (i >= this.middlewares.length) return;
      const middleware = this.middlewares[i];
      
      return middleware(context, () => dispatch(i + 1));
    };
    return dispatch(0);
  }
}

/**
 * An express-like middleware, with async support
 * 
 * @see {@link OnionModel}
 */
export class OnionModelAsync<C extends object> extends OnionModel<C> {
  protected readonly middlewares: (Middleware<C> | MiddlewareAsync<C>)[] = [];

  /**
   * Waking through current hook with given context, with async support. This should not be called manually.
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
