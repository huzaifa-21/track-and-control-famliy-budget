import { useCallback } from "react";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import Papa from "papaparse";
import { Alert } from "react-native";

export function useExportCSV() {
  const exportCSV = useCallback(
    async (data: any[], fileName = "finfam-data") => {
      if (!data || data.length === 0) {
        Alert.alert("Data", "not enough data to export");
        return;
      }
      try {
        // 1. Convert JSON to CSV text
        const csv = Papa.unparse(data);

        // 2. Create file in cache
        const fileUri = `${FileSystem.cacheDirectory}${fileName}.csv`;

        await FileSystem.writeAsStringAsync(fileUri, csv, {
          encoding: FileSystem.EncodingType.UTF8,
        });

        // 3. Share the file
        await Sharing.shareAsync(fileUri, {
          mimeType: "text/csv",
          dialogTitle: "Export FinFam Data",
          UTI: "public.comma-separated-values-text",
        });

        console.log("✅ CSV file created and shared!");
      } catch (error) {
        console.error("❌ Error exporting CSV:", error);
      }
    },
    []
  );

  return { exportCSV };
}
