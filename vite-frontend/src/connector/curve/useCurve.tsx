import { useContext } from 'react';
import { RootContext } from './CurveProvider';



export function useCurve() {
  return useContext(RootContext);
}
