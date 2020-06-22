import React from 'react';
import { connect } from 'react-redux';
import { Frame, Toast } from '@shopify/polaris';
import { closeNotification } from '../redux/actions';

const Notification = (props) => (
  <Frame>
    {props.children}
    {props.notifications.map((item, index) => (item && item.active
    ? <Toast
      // eslint-disable-next-line react/no-array-index-key
      key={index}
      content={item.message}
      onDismiss={() => props.closeNotification(index)}
      duration={props.duration || 3000}
      /> : null))}
  </Frame>
);

const mapStateToProps = (state) => ({
  notifications: state.notification.list,
});

const mapDispatchToProps = {
  closeNotification,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Notification);
