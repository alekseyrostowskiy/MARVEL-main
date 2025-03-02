import {useState, Component, memo , PureComponent, useCallback, createContext, useContext} from 'react';
import {Container} from 'react-bootstrap';

class Form extends PureComponent{
    render(){
            console.log('render');
            
            return (
                <Container>
                    <form className="w-50 border mt-5 p-3 m-auto">
                        <div className="mb-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label mt-3">Email address</label>
                            <InputComponent mail={this.props.mail}/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="exampleFormControlTextarea1" className="form-label">Example textarea</label>
                            <textarea value={this.props.text} className="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
                        </div>
                    </form>
                </Container>
            )
            }
    
}

const InputComponent = () => {

    const context = useContext(dataContext) 

        return(
            <input 
                            value={context.mail} 
                            type="email" 
                            className='form-control' 
                            id="exampleFormControlInput1" 
                            placeholder="name@example.com"
                            onFocus={context.forceChangeMail}/>     //используем этот метод
        )
}


InputComponent.contextType = dataContext;   // теперь у нас в нашем классе есть свойтво класса - context

const dataContext = createContext({
    mail: {
        name: "name@example.com"
    },
    text: 'some text',
    forceChangeMail: () => {}       // даже пустая функция сойдёт 
});    //единственный аргумент эта команда принимает значение по умолчанию 

function App() {
    const [data, setData] = useState({
        mail: {
            name: "name@example.com"
        },
        text: 'some text',
        forceChangeMail: forceChangeMail
    });

    function forceChangeMail() {                        // вот тут создаём метод, который далее будет использовать в контексте для изменения данных контекста
        setData({...data, mail: 'test@gmail.com'})  
    }

    return (
        <Provider value={data}>
            <Form mail={data.mail} text={data.text} onLog={onLog}/>
            <button 
                onClick={() => setData({
                    mail: {
                        name: "name@example.com"
                    },
                    text: 'another text'
                })}>
                Click me
            </button>
        </Provider>
    );
}

export default App;


// function propsCompare(prevProps, nextProps){
//     return prevProps.mail.name === nextProps.mail.name && prevProps.text === nextProps.text
// }

// const Form = memo((props) => {
    
  
//     console.log('render')
    
//     return (
//         <Container>
//             <form className="w-50 border mt-5 p-3 m-auto">
//                 <div className="mb-3">
//                     <label htmlFor="exampleFormControlInput1" className="form-label mt-3">Email address</label>
//                     <input value={props.mail.name} type="email" className='form-control' id="exampleFormControlInput1" placeholder="name@example.com"/>
//                     </div>
//                     <div className="mb-3">
//                     <label htmlFor="exampleFormControlTextarea1" className="form-label">Example textarea</label>
//                     <textarea value={props.text} className="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
//                 </div>
//             </form>
//         </Container>
//     )
// },propsCompare)

