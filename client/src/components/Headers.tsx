import React from 'react'
import { useStore } from '../config/store'
import { Label } from '../config/types'


const Headers = () => {

  const labels = useStore(state => state.labels)
  const updateLabels = useStore(state => state.updateLabels)
  const newLabel = useStore(state => state.newLabel)



  const labelChange = (label: Label,  text: string, key: string, id: number) => {
      let newLabel:Label = label;
      if (key === "label") newLabel["label"] = text
      else if (key === "name") newLabel["name"] = text 
      updateLabels(newLabel, id)
  }
  return (
    <div>
      <button onClick={()=>newLabel("column")}>New Column</button>
      <button onClick={()=>newLabel("cell")}>New Cell</button>
      {labels.map((l, idx) => (
      <div key={idx} className="mb-8">
        <div>
          <label>Label</label>
          <input type="text" value={l.label} className="bg-gray-100" onChange={(e) => labelChange(l, e.target.value, "label", idx)}/>
        </div>
        <div>
          <label className='capitalize'>{l.type} Name</label>
          <input type="text" value={l.name} className="bg-gray-100"onChange={(e) => labelChange(l, e.target.value, "name", idx)}/>
        </div>
      </div>))}

    </div>
  )
}

export default Headers