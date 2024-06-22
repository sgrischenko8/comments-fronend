import css from './Loader.module.scss';

export const Loader = () => {
  return (
    <div className="backdrop">
      <div className={css.loader}></div>;
    </div>
  );
};
