import React, { lazy, Suspense } from 'react';

const LazyShapeController = lazy(() => import('./ShapeController'));

/*const ShapeController = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyShapeController {...props} />
  </Suspense>
);

export default ShapeController;*/
