import React from 'react';
// import { useState, useEffect } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const BucketsList = (props) => {
	
	let buckets = null;
	if (props.bucketList){
		
		buckets = (
			<div>
			{	
				props.bucketList.map((bucket, index)=>{
					return(<ListItem key = {bucket.key} onClick = {()=>props.onLoadBucket(bucket, index)}button>
						<ListItemText primary= {bucket.name} />
					</ListItem>)
				})
			}
			</div>
		)
	}
	return (
			buckets
	)

}
export default BucketsList;
