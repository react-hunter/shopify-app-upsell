import React from 'react';
import { QuestionMarkMajorMonotone } from '@shopify/polaris-icons';
import { Icon, Tooltip } from '@shopify/polaris';
import './QuestionMark.scss';

const QuestionMark = ({ content, className, style }) => {
  return (
    <div className={className} style={style}>
      <Tooltip light preferredPosition="above" content={content}>
        <Icon color="inkLighter" source={QuestionMarkMajorMonotone} />
      </Tooltip>
    </div>
  );
};

export default QuestionMark;
