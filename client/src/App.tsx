import Headers from './components/Headers'
import { useStore } from './config/store'

function App() {

  const text = useStore(state => state.text)
  const response = useStore(state => state.response)
  const error = useStore(state => state.error)
  const loading = useStore(state => state.loading)
  const setText = useStore(state => state.setText)
  const getFormula = useStore(state => state.getFormula)



  const getResponse = async (e:React.FormEvent) => {
    e.preventDefault()
    getFormula()
  }

  return (
    <div className='w-2/3 max-w-4xl m-auto mt-24'>
      <Headers />
      <form onSubmit={getResponse} className="flex flex-col">
        <label className='mb-4'>Enter text</label>
        <textarea value={text}  className='mb-4 border h-12' onChange={(e) => setText(e.target.value as string)}/>
        <button type='submit' className='bg-blue-200 w-48 h-12 rounded-xl'>Get Formula</button>
        <p>Response:</p>
        {loading && <p>loading...</p>}
        <p>{response}</p>
        <p>{error}</p>
      </form>
    </div>
  )
}

export default App
