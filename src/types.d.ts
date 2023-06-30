import { MarkerProps } from "@react-google-maps/api";

export type Driver = { id: number; name: string; color: `#${string}` };

export type MarkerType = { position: MarkerProps["position"]; assignedDriver?: Driver };
