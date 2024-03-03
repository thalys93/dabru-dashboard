import { PieChart } from "@mui/x-charts";

interface chartProps {  
  type: string;
  id: string;  
  dataItems: [
    {
      id: string;
      value: number;
      label: string;
      color: string;      
    }
  ]
}

function Pie_Chart({...props} : chartProps) {
  return (
    <div className="flex flex-col justify-center">
    <PieChart
    colors={["#0EA5E9", "#222222"]}
      series={[
        {
          data: props?.dataItems,
          highlightScope: {faded: 'global', highlighted: 'item'},
          faded: { innerRadius: 40, additionalRadius: -30, color: 'gray'}          
        }        
      ]}
      width={250}
      height={200}      
      slotProps={{legend: {hidden: true}}}
    />
    <span className="font-blinker text-md text-stone-400 uppercase ml-[3rem]"> {props?.type} </span>
    </div>    
  )
}

export default Pie_Chart