
import { useStore } from '../config/store'
import { Label } from '../config/types'


const Headers = () => {

  const labels = useStore(state => state.labels)
  const updateLabels = useStore(state => state.updateLabels)
  const newLabel = useStore(state => state.newLabel)
  const deleteLabel = useStore(state => state.deleteLabel)



  const labelChange = (label: Label,  text: string, key: string, id: string) => {
      let newLabel:Label = label;
      if (key === "label") newLabel["label"] = text
      else if (key === "name") newLabel["name"] = text 
      updateLabels(newLabel, id)
  }
  return (
    <div className='bg-gray-700 text-white pl-12 pr-12 pt-24 pb-24 overflow-auto'>
      {/* buttons */}
      <div className='flex flex-col mb-24'>
        <button onClick={()=>newLabel("column")} className="w-48 h-8 hover:border-white border border-gray-700 rounded-lg">Map New Column</button>
        <button onClick={()=>newLabel("cell")} className="w-48 h-8 hover:border-white border border-gray-700 rounded-lg">Map New Cell</button>
      </div>
      {/* labels */}
      <div className="flex mb-2 space-x-4 font-bold text-xl">
        <p className='w-52'></p>
        <p className='w-full p-2'>Label</p>
        <p className='w-full p-2'>Column or Cell</p>
        <p className='w-12'></p>
      </div>
      {labels.map((l,idx) => (
      <div key={idx} className="mb-2 flex space-x-4 bg-gray-600 p-4 rounded-xl">
        <p className='w-16 p-2 capitalize'>{l.type}</p>
        <input type="text" value={l.label} className="bg-gray-600 hover:bg-gray-500 p-2" onChange={(e) => labelChange(l, e.target.value, "label", l.id)}/>
        <input type="text" value={l.name} className="bg-gray-600 hover:bg-gray-500 p-2"onChange={(e) => labelChange(l, e.target.value, "name", l.id)}/>
        <button className="p-2" onClick={() => deleteLabel(l.id)}>X</button>
      </div>))}

    </div>
  )
}

export default Headers