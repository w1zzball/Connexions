import './Row.css'

export default function Row({color="#F9DF6D",question="asdasd",tileString="addsasd"}){
    return(
        <div className="row"
            style={{backgroundColor: color}}
        >
            <p className="question">{question}</p>
            <p className="tile-string">{tileString}</p>
        </div>
    )
}