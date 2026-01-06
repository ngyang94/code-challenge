import { useEffect, useState, useRef } from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

import api from "./api/api";
import Preloader from "./components/Preloader";
import AlertDismissible from "./components/AlertMessage";
import type {swapCurFormType,currencyExchangeType} from "./models/models";
import './App.css'


function App() {

  // for display loading widget when do api call
  const [isLoading,setIsLoading] = useState(false);

  // for display api message
  const [apiStatus,setApiStatus] = useState<{status:number,message:string}>({
    status:0,
    message:""
  });

  const [currencyExchangeRateList,setCurrencyExchangeRateList] = useState<[currencyExchangeType]|[]>([]);

  // status and data field of the swap currency form
  const [swapCurForm,setSwapCurForm] = useState<swapCurFormType>({
    inputAmount:{
      value:"",
      validated:false,
      invalidFeedback:"",
    },
    inputAmountExchangeCurrency:{
      currency:"",
      price:"",
      validated:false,
      invalidFeedback:"",
    },
    outputAmountExchangeCurrency:{
      currency:"",
      price:"",
      validated:false,
      invalidFeedback:"",
    },
    outputAmount:{
      value:"",
    }
  });

  const inputAmountRef = useRef<HTMLInputElement>(null);


  // do api call to get the currency exchange rate
  async function getAndSetCurrencyExchangeRateList(){
    setIsLoading(true);
    const response:{status:number,data:[currencyExchangeType],statusText:string} = await api.get("prices.json");
    setIsLoading(false);
    
    if(response.status<300){
      setCurrencyExchangeRateList([...response.data]);
    }else{
      setApiStatus({status:response.status,message:response.statusText})
      setCurrencyExchangeRateList([]);
    }
  }


  // validate all field in swap currency form and submit (fake exchange submit)
  async function submitSwapCurFormHandler(event:React.FormEvent<HTMLFormElement>){
    event.preventDefault();
    event.stopPropagation();

    const inputAmountExchangeCurrency:currencyExchangeType = {
      currency:swapCurForm.inputAmountExchangeCurrency.currency,
      price:swapCurForm.inputAmountExchangeCurrency.price
    };
    const outputAmountExchangeCurrency:currencyExchangeType = {
      currency:swapCurForm.outputAmountExchangeCurrency.currency,
      price:swapCurForm.outputAmountExchangeCurrency.price
    };

    const inputAmountExchangeCurrencyIsValid = validateInputAmountExchangeCurrencyDropdown(inputAmountExchangeCurrency);
    const outputAmountExchangeCurrencyIsValid = validateOutputAmountExchangeCurrencyDropdown(outputAmountExchangeCurrency);

    if(validateInputAmountField()&&inputAmountExchangeCurrencyIsValid&&outputAmountExchangeCurrencyIsValid){
      setIsLoading(true)
      setTimeout(function(){
        setApiStatus({
          status:200,
          message:"Exchanged successfully."
        })
        setIsLoading(false)
      },2000)
    }
  }


  // validate input amount field
  function validateInputAmountField(){
    
    const inputAmount = inputAmountRef.current?.value.trim();
    const numRegex = new RegExp("^([0-9]*[.])?[0-9]+$","g");

    // if input is empty
    if(!inputAmount){ 
      setSwapCurForm((prevValue)=>{
        return {
          ...prevValue,
          inputAmount:{
            value:prevValue.inputAmount.value,
            validated: true,
            invalidFeedback:"This field is required.",
          },
          outputAmount:{
            value:"",
          }
        }
      })
      return false;

    // if input is not a number
    }else if(!numRegex.test(inputAmount)){ 
      setSwapCurForm((prevValue)=>{
        return {
          ...prevValue,
          inputAmount:{
            value:prevValue.inputAmount.value,
            validated: true,
            invalidFeedback:"Invalid Number.",
          },
          outputAmount:{
            value:"",
          }
        }
      })
      return false;
    }
    setSwapCurForm((prevValue)=>{
      return {
        ...prevValue,
        inputAmount:{
          value:prevValue.inputAmount.value,
          validated: true,
          invalidFeedback:"",
        },
        outputAmount:{
          value:prevValue.outputAmount.value,
        }
      };
    })
    return true;
  }


  // handle onchange for input amount
  function inputAmountHandler(event:React.ChangeEvent<HTMLInputElement>){
    
    const value = event.currentTarget.value.trim()||"";
    // validate input on user input
    setSwapCurForm((prevValue)=>{
      return {
        ...prevValue,
        inputAmount:{
          value:value,
          validated: false,
          invalidFeedback:"",
        },
      }
    });
    
    if(validateInputAmountField()&&currencyExchangeRateList.length!=0&&swapCurForm.outputAmountExchangeCurrency.price&&swapCurForm.inputAmountExchangeCurrency.price){
      
      setSwapCurForm((prevValue)=>{
        return {
          ...prevValue,
          outputAmount:{
            value:calculateExchange(parseInt(value)||0,swapCurForm.inputAmountExchangeCurrency.price||0,swapCurForm.outputAmountExchangeCurrency.price||0),
          }
        }
      })
    }

  }


  // calculate currency exchange
  function calculateExchange(inputAmountValue:number,inputCurrencyExchangeRate:number,outputCurrencyExchangeRate:number){
    return  inputAmountValue*inputCurrencyExchangeRate/outputCurrencyExchangeRate;
  }

  
  // validate exchange currency dropdown
  function validateInputAmountExchangeCurrencyDropdown(currencyExchangeRate:currencyExchangeType|undefined){
    
    if(!currencyExchangeRate||!!currencyExchangeRate&&!currencyExchangeRate.currency){
      setSwapCurForm((prevValue)=>{
        return {
          ...prevValue,
          inputAmountExchangeCurrency:{
            invalidFeedback:"Please select an exchange currency.",
            currency:"",
            price:"",
            validated: true,
          }
        }
      });
      return false;
    }
    return true;

  }


  // handle onchange for dropdown at input amount
  function inputAmountExchangeCurrencyDropdownHandler(event:React.ChangeEvent<HTMLSelectElement>){
    const value = event.currentTarget.value
    const selectedCurrency = currencyExchangeRateList.find((currencyExchangeRate)=>currencyExchangeRate.currency==value)
    setSwapCurForm((prevValue)=>{
      return {
        ...prevValue,
        inputAmountExchangeCurrency:{
          currency:selectedCurrency?.currency||"",
          price:selectedCurrency?.price||"",
          validated: true,
          invalidFeedback:"",
        },
      }
    });

    // validate the input amount field and calculate and set the output amount after set dropdown field located input amount field
    const inputAmountExchangeCurrencyIsValid = validateInputAmountExchangeCurrencyDropdown(selectedCurrency)
    if(validateInputAmountField()&&currencyExchangeRateList.length!=0&&swapCurForm.outputAmountExchangeCurrency.price&&inputAmountExchangeCurrencyIsValid){
      
      setSwapCurForm((prevValue)=>{
        return {
          ...prevValue,
          outputAmount:{
            value:calculateExchange(parseInt(swapCurForm.inputAmount.value)||0,selectedCurrency?.price||0,swapCurForm.outputAmountExchangeCurrency.price||0),
          }
        }
      })
    }
  }

  
  // validate exchange currency dropdown
  function validateOutputAmountExchangeCurrencyDropdown(currencyExchangeRate:currencyExchangeType|undefined){
    
    if(!currencyExchangeRate||!!currencyExchangeRate&&!currencyExchangeRate.currency){
      setSwapCurForm((prevValue)=>{
        return {
          ...prevValue,
          outputAmountExchangeCurrency:{
            invalidFeedback:"Please select an exchange currency.",
            currency:"",
            price:"",
            validated: true,
          }
        }
      });
      return false;
    }
    return true;

  }
  

  // handle onchange for dropdown at output amount
  function outputAmountExchangeCurrencyDropdownHandler(event:React.ChangeEvent<HTMLSelectElement>){
    const value = event.currentTarget.value
    const selectedCurrency = currencyExchangeRateList.find((currencyExchangeRate)=>currencyExchangeRate.currency==value)
    setSwapCurForm((prevValue)=>{
      return {
        ...prevValue,
        outputAmountExchangeCurrency:{
          currency:selectedCurrency?.currency+"",
          price:selectedCurrency?.price||"",
          validated: true,
          invalidFeedback:"",
        },
      }
    });

    // validate the output amount field and calculate and set the output amount after set dropdown field located output amount field
    const outputAmountExchangeCurrencyIsValid = validateOutputAmountExchangeCurrencyDropdown(selectedCurrency)
    if(validateInputAmountField()&&currencyExchangeRateList.length!=0&&swapCurForm.inputAmountExchangeCurrency.price&&outputAmountExchangeCurrencyIsValid){
      
      setSwapCurForm((prevValue)=>{
        return {
          ...prevValue,
          outputAmount:{
            value:calculateExchange(parseInt(swapCurForm.inputAmount.value)||0,swapCurForm.inputAmountExchangeCurrency.price||0,selectedCurrency?.price||0),
          }
        }
      })
    }
  }
  

  useEffect(()=>{

    if(currencyExchangeRateList.length==0){
      getAndSetCurrencyExchangeRateList()
    }
    
  },[])


  return (

    <Container>
      {
        isLoading&&<Preloader />
      }
      {!!apiStatus.status&&<AlertDismissible status={apiStatus.status<=300?"success":"danger"} show={!!apiStatus.status} close={()=>{setApiStatus({status:0,message:""})}} onClose={()=>{setApiStatus({status:0,message:""})}}>{apiStatus.message}</AlertDismissible>}
      <Form className='swap-currency-form' validated={swapCurForm.inputAmount.validated&&swapCurForm.inputAmountExchangeCurrency.validated&&swapCurForm.outputAmountExchangeCurrency.validated} onSubmit={submitSwapCurFormHandler} noValidate>
        <h5>Swap</h5>
        <Row>
          <Col md="12" lg="6" className='mb-3'>

            <Form.Label>Amount to send</Form.Label>

            <InputGroup className="mb-3">
              <Row>
                <Col lg={7} md={7} xs={12}>
                  <Form.Control
                    required
                    type="text"
                    pattern="^([0-9]*[.])?[0-9]+$"
                    placeholder=""
                    name="input-amount"
                    value={swapCurForm.inputAmount.value}
                    onChange={inputAmountHandler}
                    ref={inputAmountRef}
                  />
                  
                  <Form.Control.Feedback type="invalid" className='mb-3'>
                    {swapCurForm.inputAmount.invalidFeedback}
                  </Form.Control.Feedback>

                </Col>
                <Col lg={5} md={5} xs={12}>
                  <Form.Select required onChange={(e)=>inputAmountExchangeCurrencyDropdownHandler(e)}>
                    <option value="">Please Select</option>
                    {
                      currencyExchangeRateList&&currencyExchangeRateList.map((currencyExchangeRate,index)=>{
                        return (
                          <option key={index} value={currencyExchangeRate.currency}>{currencyExchangeRate.currency}</option>
                        )
                      })
                    }
                  </Form.Select>
                  
                  <Form.Control.Feedback type="invalid" className='mb-3'>
                    {swapCurForm.inputAmountExchangeCurrency.invalidFeedback}
                  </Form.Control.Feedback>

                </Col>
              </Row>
              
            </InputGroup>

          </Col>

          <Col md="12" lg="6" className='mb-3'>

            <Form.Label>Amount to receive</Form.Label>
            <InputGroup className="mb-3">
              <Row>
                <Col lg={7} md={7} xs={12}>
                    <Form.Control
                      required
                      type="text"
                      name="output-amount"
                      value={swapCurForm.outputAmount.value}
                      disabled
                    />
                </Col>
                <Col lg={5} md={5} xs={12}>
                  <Form.Select required onChange={outputAmountExchangeCurrencyDropdownHandler}>
                    <option value="">Please Select</option>
                    {
                      currencyExchangeRateList&&currencyExchangeRateList.map((currencyExchangeRate,index)=>{
                        return (
                          <option key={index} value={currencyExchangeRate.currency}>{currencyExchangeRate.currency}</option>
                        )
                      })
                    }
                  </Form.Select>
                    
                  <Form.Control.Feedback type="invalid" className='mb-3'>
                    {swapCurForm.outputAmountExchangeCurrency.invalidFeedback}
                  </Form.Control.Feedback>
                </Col>
              </Row>
              
            </InputGroup>


          </Col>
        </Row>
        <Button variant='primary' type='submit' className='text-uppercase'>confirm swap</Button>
      </Form>

    </Container>
  )
}

export default App
