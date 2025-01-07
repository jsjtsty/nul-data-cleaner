import { Box, Button, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NulReviseDatabase } from "../../util/database/NulReviseDatabase";
import { asyncAction } from "../../util/system/Promise";
import { DataEntry, Parser } from "../../util/parsers/Parser";

interface NulUploaderProps<T> {
  parser: Parser<T>;
  resultParser: Parser<T>;
  dataStore: string;
}

const NulUploader = <T extends DataEntry>(props: NulUploaderProps<T>) => {

  const { parser, resultParser, dataStore } = props;

  const [loaded, setLoaded] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = async () => {
        try {
          const fileData = reader.result as string;
          const parsed = parser.readOriginString(fileData);
          const db = new NulReviseDatabase<T>(dataStore);
          await db.connect();
          await db.write(parsed);
          db.close();
          setLoaded(true);
        } catch (error) {
          console.error(error);
        }
      };

      reader.readAsText(file);
    }
  };

  const handleFileUploadResult = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = async () => {
        try {
          const fileData = reader.result as string;
          const parsed = resultParser.readOriginString(fileData);
          const db = new NulReviseDatabase<T>(dataStore);
          await db.connect();
          await db.write(parsed);
          db.close();
          setLoaded(true);
        } catch (error) {
          console.error(error);
        }
      };

      reader.readAsText(file);
    }
  };

  useEffect(() => {
    if (!loaded) {
      asyncAction({
        action: async () => {
          const db = new NulReviseDatabase<T>(dataStore);
          await db.connect();
          const data = await db.load();
          db.close();
          if (data.length > 0) {
            setLoaded(true);
          }
        }
      });
    } else {
      navigate('../editor');
    }
  }, [loaded, navigate, dataStore]);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
      <Typography variant="h4" gutterBottom>
        Upload JSON File
      </Typography>
      <Stack direction='row' spacing={2}>
        <input
          accept=".json"
          style={{ display: 'none' }}
          id="upload-file"
          type="file"
          onChange={handleFileUpload}
        />
        <label htmlFor="upload-file">
          <Button variant="contained" component="span">
            Upload
          </Button>
        </label>
        <input
          accept=".json"
          style={{ display: 'none' }}
          id="upload-file-result"
          type="file"
          onChange={handleFileUploadResult}
        />
        <label htmlFor="upload-file-result">
          <Button variant="contained" component="span">
            Upload Result
          </Button>
        </label>
      </Stack>
    </Box>
  );
};

export default NulUploader;