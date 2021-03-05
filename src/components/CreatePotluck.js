//Form for creating a potluck
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { axiosWithAuth } from '../utils/axiosWithAuth';
import * as yup from 'yup'; //install yup

const initialValues = { 
    potluckname: '',
    date: '',
    time: '', 
    location: ''
};


const CreatePotluck = () => {
    const [ formValues, setFormValues ] = useState(initialValues);
    const userID = localStorage.getItem('userID');
    const history = useHistory();
    const [submitResult, setSubmitResult] = useState('');

    const [errors, setErrors] = useState ({
        potluckname: '',
        date: '',
        time: '',
        location: '',
    })

    const [disabled, setDisabled] = useState(true)

    const formSchema = yup.object().shape({
        potluckname: yup.string().required ("Add a name for your potluck"),
        date:yup.string().required ("Add a date for your potluck"),
        time:yup.string().required ("Add a time for your potluck"),
        location:yup.string().required ("Add a location for your potluck"),
    })

    const changeHandler = (name , value) => {
        yup
        .reach(formSchema, name)
        .validate(value)
        .then ((valid) => {
            setErrors({
            ...errors,
            [name]: "",
        });
    })
    .catch((err) => {
        setErrors ({
            ...errors,
            [name]: err.errors[0],
        });
    });
    setFormValues({
        ...formValues,
        [name] : value,
    });
  };

  // event handler
  const change = (event) => {
    const { name, value } = event.target;
    changeHandler(name, value);
  };

  const handleSubmit = e => {
    e.preventDefault();
    axiosWithAuth()
    .post(`/api/users/${userID}/potlucks`, formValues)
    .then(res => {
        console.log(res);
        setSubmitResult('Potluck Successfully Created!');
        history.push('/dash');
    })
    .catch(err => {
        console.log(err);
        setSubmitResult(`Error: ${err.response.data.message}`);
    });
};
  
  useEffect(() => {
    formSchema.isValid(formValues).then((valid) => {
      setDisabled(!valid);
    });
  }, [formSchema, formValues]);



    // const handleChange = e => {
    //     const { name, value } = e.target;
    //     setFormValues({...formValues, [name]: value});
    // };


    return(
        <div>
            <p>{submitResult}</p>
            <form onSubmit={handleSubmit}>
                <h1>Create Potluck</h1>

                <div> {errors.potluckname} </div>

                <label>
                    Potluck Name
                    <input type='text' name='potluckname' value={formValues.potluckname} onChange={change} />
                </label>

                <div> {errors.date} </div>

                <label>
                    Date
                    <input type='text' name='date' value={formValues.date} onChange={change}/>
                </label>

                <div> {errors.time} </div>

                <label>
                    Time
                    <input type='text' name='time' value={formValues.time} onChange={change}/>
                </label>

                <div> {errors.location} </div>

                <label>
                    Location 
                    <input type='text' name='location' value={formValues.location} onChange={change}/>
                </label>
                <button disabled = {disabled}>Submit</button>
            </form>
        </div>
    )
};

export default CreatePotluck;