import React, { Suspense } from 'react';
import { Spinner } from 'react-bootstrap';

interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const LazyWrapper: React.FC<LazyWrapperProps> = ({ 
  children, 
  fallback = (
    <div className="lazy-loading">
      <Spinner animation="border" variant="primary" />
      <p>Yükleniyor...</p>
    </div>
  )
}) => {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
};

export default LazyWrapper;
