import React from 'react'
import { useStore } from '../config/store'


const Headers = () => {

  const columns = useStore(state => state.columns)
  const cells = useStore(state => state.cells)
  const updateColumns = useStore(state => state.updateColumns)
  const updateCells = useStore(state => state.updateCells)
  const newColumn = useStore(state => state.newColumn)
  const newCell = useStore(state => state.newCell)


type Column = {
  id: number;
  header: string;
  column: string;
}

type Cell = {
  id: number;
  header: string;
  cell: string;
}


  const columnOnChange = (column: Column,  text: string, type: string, id: number) => {
      let newCol:Column = column;
      if (type === "header") {
        newCol.header = text
      } else if (type === "column") {
        newCol.column = text
      }
      updateColumns(newCol, id)
  }

  const cellOnChange = (cell: Cell,  text: string, type: string, id: number) => {
    let newCell:Cell = cell;
    if (type === "header") {
      newCell.header = text
    } else if (type === "cell") {
      newCell.cell = text
    }
    updateCells(newCell, id)
}
  return (
    <div>
      <button onClick={()=>newColumn()}>New Column</button>
      <br></br>
      <button onClick={()=>newCell()}>New Cell</button>
      {/* array off columns */}
      {columns.map((col, idx) => (
      <div key={idx} className="mb-8">
        <div>
          <label>Column Title</label>
          <input type="text" value={col.header} className="bg-gray-100" onChange={(e) => columnOnChange(col, e.target.value, "header", idx)}/>
        </div>
        <div>
          <label>Column</label>
          <input type="text" value={col.column} className="bg-gray-100"onChange={(e) => columnOnChange(col, e.target.value, "column", idx)}/>
        </div>
      </div>))}

      {/* array off cells */}
      {cells.map((cell, idx ) => (
        <div key={idx}>
          <div>
          <label>Cell Title</label>
          <input type="text" value={cell.header} className="bg-gray-100" onChange={(e) => cellOnChange(cell, e.target.value, "header", idx)}/>
        </div>
        <div>
          <label>Cell</label>
          <input type="text" value={cell.cell} className="bg-gray-100"onChange={(e) => cellOnChange(cell, e.target.value, "cell", idx)}/>
        </div>
        </div>
      ))}

    </div>
  )
}

export default Headers