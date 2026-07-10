import devicesRaw from "@site/data/devices.json";
import hardwareRaw from "@site/data/hardware.json";
import desRaw from "@site/data/desktop-environments.json";
import distrosRaw from "@site/data/linux-distributions.json";
import androidRaw from "@site/data/android-versions.json";
import matrixRaw from "@site/data/compatibility-matrix.json";
import testsRaw from "@site/data/test-results.json";
import configsRaw from "@site/data/verified-configurations.json";
import type {
  AndroidVersion,
  DesktopEnvironment,
  Device,
  HardwareItem,
  LinuxDistribution,
  MatrixRow,
  TestResult,
  VerifiedConfigurationEntry,
} from "@site/src/types/compatibility";

export const devices = devicesRaw as Device[];
export const hardware = hardwareRaw as HardwareItem[];
export const desktopEnvironments = desRaw as DesktopEnvironment[];
export const linuxDistributions = distrosRaw as LinuxDistribution[];
export const androidVersions = androidRaw as AndroidVersion[];
export const matrix = matrixRaw as MatrixRow[];
export const testResults = testsRaw as TestResult[];
export const verifiedConfigurations = configsRaw as VerifiedConfigurationEntry[];

export const deviceById = (id: string) => devices.find((d) => d.id === id);
export const hardwareById = (id: string) => hardware.find((h) => h.id === id);
export const distroById = (id: string) => linuxDistributions.find((d) => d.id === id);
export const deById = (id: string) => desktopEnvironments.find((d) => d.id === id);
export const configById = (id: string) => verifiedConfigurations.find((c) => c.id === id);
