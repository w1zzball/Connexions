import './Row.css'

export default function Row({color="#F9DF6D",answer="asdasd",tileString="addsasd"}){
    return(
        <div className="row"
            style={{backgroundColor: color}}
        >
            <p className="answer">{answer}</p>
            <p className="tile-string">{tileString}</p>
        </div>
    )
}