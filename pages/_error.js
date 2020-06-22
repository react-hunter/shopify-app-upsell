import React, { Component } from "react";
// import Styles from "../containers/_error.scss";
import styled from 'styled-components';

const Box = styled.div`
  text-align: center;
  align-self: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px 20px;
  max-width: 450px;
  margin: auto;
  justify-content: center;
  p {
  -webkit-margin-after: 0px;
  -webkit-margin-before: 0px;
  font-size: 15px;
  color: #637381;
  line-height: 21px;
  margin-bottom: 4px;
}
code {
  background: #313440;
  border-radius: 4px;
  padding: 2px 6px;
  color: #d9dcef;
}

code span {
  color: #d093e3;
}

p a {
  color: #408fec;
}

`

const Title = styled.div`
  font-size: 22px;
  font-weight: 100;
  margin-top: 15px;
  color: #637381;
  margin-bottom: 8px;
`

class ErrorPage extends Component {

  static getInitialProps({ res, xhr }) {
    const errorCode = res ? res.statusCode : xhr ? xhr.status : null;
    return { errorCode };
  }

  render() {
    const { errorCode } = this.props;
    return (
      <React.Fragment>
        <Box>
          <img src="https://conversion-bear-public.s3.us-east-2.amazonaws.com/convresionbear-static-pages/error_bear.svg" />
          <Title class="message__title">Something's not right</Title>
          <p>
            Please try again in a few moments. <br />
            🚨 If the app doesn’t work -&nbsp;
            <a href="https://www.conversionbear.com/contact-us" target="_blank">
              contact us
            </a>
            .{errorCode && <code>Error code: ${errorCode}</code>}
          </p>
        </Box>
      </React.Fragment>
    );
  }
}

export default ErrorPage;
