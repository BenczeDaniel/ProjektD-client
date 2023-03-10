import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { checkUsername } from "./getData";
import {useMutation} from 'react-query';
import { checkEmail } from "./getData";
import { validate } from 'react-email-validator';
import { register } from "./getData";
import {
  Input,  
} from "reactstrap";



export const MyModal=({modal,setModal,setLoginModal,loginmodal}) => {
  const navigate = useNavigate()
  const [isValidU,setIsValidU] = useState(null)
  const [username,setUsername] = useState('')
  const [email,setEmail] = useState('')
  const [isValidE,setIsValidE] = useState(null)
  const [password,setPassword] = useState('')
  const [isValidP,setIsValidP] = useState(null)
  const [success,setSuccess] = useState(null)
  const [msg,setMsg] = useState('')





  const toggle = () => setModal(!modal);

  const mutationCheckUsername=useMutation(checkUsername,{
    onSuccess:(data)=>{
      console.log(data.data.rowCount,data.data.username)
      if(data.data.rowCount==0)
        setIsValidU(true)
      else
        setIsValidU(false)
    }
  })
  const handleCheckUsername = () =>{
    if(username)
      mutationCheckUsername.mutate({username:username})
    else
      setIsValidU(false)
  }

  const handleCheckEmail = () =>{
    if(validate(email))
      mutationCheckEmail.mutate({email:email})
    else
      setIsValidE(false)
  }

  const mutationCheckEmail=useMutation(checkEmail,{
    onSuccess:(data)=>{
      console.log(data.data.rowCount,data.data.email)
      if(data.data.rowCount==0)
        setIsValidE(true)
      else
        setIsValidE(false)
    }
  })

  const handleCheckPassword = () =>{
    password.length<6 ? setIsValidP(false) : setIsValidP(true)
  }

  const mutationCheckRegister=useMutation(register,{
    onSuccess:(data)=>{
      if(data.data?.id){
        setSuccess(true)
        setUsername('')
        setPassword('')
        setEmail('')
        setIsValidU(null)
        setIsValidP(null)
        setIsValidE(null)
      }
      else{
        setSuccess(false)
      }
      setMsg(data.data.msg)
    }
  })


const handleLogin = () => {
  toggle()
  setLoginModal(!loginmodal);
  navigate('/login')
}


  return (
    <div className='mymodal bg-light'>
      <Modal className='regmodal' isOpen={modal} fade={false} toggle={toggle}>
        <ModalHeader className='reg1' toggle={toggle}>Regisztr??ci??</ModalHeader>
        <ModalBody className='reg2'>A mez??k kit??lt??se k??telez??! <br /> <br /> 

        <label className='regpanel2' for="username"><b>Felhaszn??l??n??v:</b></label><br />
            <input  className= {isValidU==null ? "" :(isValidU ? "is-valid" : "is-invalid")}
          onKeyPress={(e)=>e.key=='Enter' ? document.getElementById("email").focus() : ''}
          onBlur={handleCheckUsername}
          value={username} 
          autoFocus 
          onChange={(e)=>setUsername(e.target.value)} />
          <br />
            <label className='regpanel2' for="password"><b>Jelsz??: <br /> </b></label><br />
            <p>* Olyan jelsz??t v??lassz amelyet m??g nem haszn??lt??l m??s fel??leten, a vissza??l??sek elker??l??s??nek ??rdek??ben (az ilyen vissza??l??sekkel kapcsolatosan nem ??ll m??dunkban felel??ss??get v??llalni)!</p>
            <input type="password" 
        id="password" 
        className= {isValidP==null ? "" :(isValidP ? "is-valid" : "is-invalid")}
        onBlur={handleCheckPassword}
        value={password}
        onKeyPress={(e)=>e.key=='Enter' ? document.getElementById("email").focus() : ''} 
        onChange={(e)=>setPassword(e.target.value)} /> <br />
            <label className='regpanel2' for="email"><b>E-mail:</b></label><br />
            <input type="email" 
        id="email" 
        className={isValidE==null ? "" :(isValidE ? "is-valid" : "is-invalid")} 
        onBlur={handleCheckEmail} 
        onKeyPress={(e)=>e.key=='Enter' ? document.getElementById("password").focus() : ''} 
        value={email} 
        onChange={(e)=>setEmail(e.target.value)} /> <br />  

        </ModalBody>

        <div className="reggomb text-center ">
      <Input 
      id="done"
      type="button" 
      disabled={!isValidU || !isValidP || !isValidE} 
      value="Regisztr??ci??" 
      className="reggomb2 btn btn-dark"
      onClick={()=>mutationCheckRegister.mutate({username:username,email:email,password:password})}
      />
      </div>
      <h4 className="msg text-center m-3 text-success">{msg}</h4>
      {success && <div className="btn btn-success"
      onClick={handleLogin}
      >Jelentkezz be !</div>}    


      

      </Modal>
    </div>
  );
}
