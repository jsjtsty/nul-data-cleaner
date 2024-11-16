import { Box, Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AgricultureMultipleDataEntry, AgricultureMultipleParser } from "../../util/parsers/AgricultureMultipleParser";
import { NulReviseDatabase } from "../../util/database/NulReviseDatabase";

const UploadPage: React.FC = () => {

  const [loaded, setLoaded] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = async () => {
        try {
          const fileData = reader.result as string;
          const parser = new AgricultureMultipleParser();
          const parsed = parser.readOriginString(fileData);
          const db = new NulReviseDatabase<AgricultureMultipleDataEntry>('test');
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
    const operation = async () => {
      if (!loaded) {
        const db = new NulReviseDatabase<AgricultureMultipleDataEntry>('test');
        await db.connect();
        const data = await db.load();
        db.close();
        if (data.length > 0) {
          setLoaded(true);
        }
      } else {
        navigate('/editor');
      }
    };

    operation()
      .catch((err) => {
        console.error(err);
      });
  }, [loaded, navigate]);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
      <Typography variant="h4" gutterBottom>
        Upload JSON File
      </Typography>
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
    </Box>
  );
};

export default UploadPage;