import { Typography } from '@mui/material';
import { diffChars } from 'diff';
import React from 'react';


interface NulTextDifferenceProps {
  reference: string;
  text: string;
  compare?: boolean;
}

const NulTextDifference: React.FC<NulTextDifferenceProps> = (props) => {

  const { reference, text, compare = true } = props;

  return (
    <Typography>
      {compare && (
        diffChars(reference, text).map((part, index) => {
          const color = part.added ? 'lightgreen' : part.removed ? 'lightcoral' : 'white';
          return (
            <Typography
              key={index}
              component="span"
              style={{
                backgroundColor: color,
                textDecoration: part.removed ? 'line-through' : 'none',
                whiteSpace: 'pre-line'
              }}
            >
              {part.value}
            </Typography>
          );
        }))}
    </Typography>
  );
};

export default NulTextDifference;