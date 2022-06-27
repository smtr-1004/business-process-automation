import axios from "axios"
import { useEffect, useState } from "react"
import { Text, Button, TextArea } from '@fluentui/react-northstar';
import Stages from './Stages'

export default function SelectPipeline(props) {

    const [pipelines, setPipelines] = useState(null)
    const [newPipelineName, setNewPipelineName] = useState("")
    const [selectedPipeline, setSelectedPipeline] = useState(null)

    useEffect(() => {
        try {
            axios.get('/api/config?id=pipelines').then(ret => {
                if (ret.data === '') {
                    setPipelines("None")
                } else {
                    setPipelines(ret.data.pipelines)
                }

            })
        } catch (err) {
            console.log(err)
        }
    }, [])

    const onPipelineNameChange = (event) => {
        setNewPipelineName(event.target.value)
    }

    const onCreatePipeline = async () => {
        console.log(newPipelineName)
        const currentPipelines = await axios.get('/api/config?id=pipelines')
        if (currentPipelines.data === '') {
            await axios.post('/api/config', { pipelines: [{ stages: [], name: newPipelineName }], id: "pipelines" })
        } else {
            currentPipelines.data.pipelines.push({ stages: [], name: newPipelineName })
            await axios.post('/api/config', currentPipelines.data)
        }
    }

    const onPipelineSelect = (pn) => {
        if(pipelines){
            for(const p of pipelines){
                if(p.name === pn){
                    setSelectedPipeline(p)
                }
            }
        }
    }

    const renderPipelines = () => {
        if (pipelines && pipelines !== '') {
            return (
                pipelines.map(p=><div onClick={()=>onPipelineSelect(p.name)} value={p.name} style={{marginBottom : "20px", color : "blue"}}>{p.name}</div>)
            )
        }
    }

    if(selectedPipeline){
        return(<Stages onSelectContent={props.onSelectContent} selectedPipelineName={selectedPipeline.name}/>)
    } else {
        return (
            <div style={{ paddingTop: "50px" }}>
                <Text weight="semibold" content="Create Or Select A Pipeline" style={{ fontSize: "18px", display: "block", width: "100%", marginBottom: "20px" }} />
                <p style={{ marginBottom: "20px" }} >BPA Accelerator can support more than one pipeline.  Each pipeline is linked to a directory in Blob Storage.  The path of the linked pipeline will be presented when the pipeline is created.</p>
                <Text weight="semibold" content="Existing Pipelines" style={{ fontSize: "14px", display: "block", width: "100%", marginBottom: "20px" }} />
                <div style={{ paddingBottom: "50px" }}>
                    {renderPipelines()}
                </div>
                <Text weight="semibold" content="Create New Pipeline" style={{ fontSize: "14px", display: "block", width: "100%", marginBottom: "20px" }} />
                <div style={{ paddingBottom: "50px" }}>
                    <Text content="Enter New Pipeline Name" style={{ fontSize: "14px", display: "block", width: "100%", marginBottom: "20px" }} />
                    <TextArea style={{ height: "30px" }} value={newPipelineName} onChange={onPipelineNameChange} />
                </div>
    
                <Button content="Create New Pipeline" primary onClick={onCreatePipeline} />
            </div>
        )
    }
    

}