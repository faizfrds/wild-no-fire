import React from 'react'
import { InferenceResponse } from '@/types/Types'


export default function Risk(output: InferenceResponse) {
  return (
    <div>
        
        <div>
            {output.predictions[0].class}
            {output.predictions[0].confidence * 100} %
        </div>
        <div>
            {output.predictions[1].class}
            {output.predictions[1].confidence * 100} %
        </div>
    </div>
  )
}
