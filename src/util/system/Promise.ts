
interface AsyncActionParams<T> {
  action: () => Promise<T>;
  then?: (res: T) => void;
  catch?: (err: unknown) => void;
}

const asyncAction = <T = void>(params: AsyncActionParams<T>) => {
  const {
    action,
    then: onThen = () => { },
    catch: onCatch = (err) => {
      console.error(err);
    }
  } = params;

  action().then(onThen).catch(onCatch);
};

export { asyncAction };