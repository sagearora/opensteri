import { useContext } from "react";
import { ClinicContext } from "./ClinicProvider";


export function useClinic() {
  return useContext(ClinicContext);
}
