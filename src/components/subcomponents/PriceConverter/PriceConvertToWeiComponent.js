import React from 'react';
import { Form, Container, Row, Col } from 'react-bootstrap';
import { ETHDecimals, ETHFactor } from '../../../config';

const func = require("../../../functions/PriceConverterFunctions.js");

class PriceConvertToWeiComponent extends React.Component {
    state = {
      AmountUSDText : "",
      AmountUSD : 0,
      AmountETH : 0
    };

    Convert = async (event) => {
      event.preventDefault();

      this.state.AmountUSD = this.state.AmountUSDText.trim();
      let result = await func.USDsToWeis(this.state.AmountUSD, this.props.contract);
      if(true == result[1]) this.state.AmountETH = await result[0].dividedBy(ETHFactor).dp(ETHDecimals, 0).toString();
      else this.state.AmountETH = ""
      this.setState({ AmountUSDText: ""})
    };
    
    render(){
      return (
        <div>
         <h3>Check USD/ETH Exchange Rate</h3>
         <Form onSubmit={this.Convert} style={{margin: '50px 50px 50px 50px' }}>
            <Form.Group  className="mb-3">
              <Form.Control type="number" step="0.01" name="AmountUSD" placeholder="Amount in USD" 
                  value={this.state.AmountUSDText}
                  onChange={event => this.setState({ AmountUSDText: event.target.value })}/>
            </Form.Group>
            <button class="btn btn-secondary">Convert</button> 
          </Form>
          <Container style={{margin: '10px 50px 50px 50px' }}>
              <Row>
                <Col><b>Amount In ETH :</b></Col> 
                <Col>{this.state.AmountETH} ({this.state.AmountUSD}USD)</Col>
              </Row>
          </Container>
          <hr class="bg-secondary"/>
        </div>
      );
    }
  }
  
export default PriceConvertToWeiComponent;