import axios from 'axios';
import { useState, useEffect, useMemo } from 'react';
import { FaArrowsAlt } from 'react-icons/fa';
import { TbRectangle } from 'react-icons/tb';
import AnnotationCanvas from "./AnnotationCanvas/AnnotationCanvas"
import ImagesBand from './ImagesBand/ImagesBand';
import ShapeController from './ShapeController/ShapeController';
import './AnnotationTool.css';
import genericImageIcon from '~/assets/generic_image_icon.png'
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FileUploadButton from '../Utils/FileUploadButton/FileUploadButton';

const background = new Image();

const AnnotationTool = () => {
	const segmentId = 5;
	const siteId = 1;
  	const [initialLoading , setInitialLoading] = useState<any>(true);
  	const [initialError , setInitialError] = useState<any>(false);
	const [saving, setSaving] = useState(false);
	//const [selectedImageId , setSelectedImageId] = useState<any>(null);
	const [labels, ] = useState<string[]>(["Motorbike", "Car", "Bus", "Small Truck", "Big Truck", "Construction Machine"]);
	const [activeLabelId, setActiveLabelId] = useState<number>(0);
	const [mode, setMode] = useState("select"); // select, create
	//const [shapes, setShapes] = useState<any[]>([]);
	/* States */
	const [page , setPage] = useState(1);

	/** Redux */
	const [selectedImageId, setSelectedImageId] = useState("");
	//const selectedImageId = useSelector((state: any) => state.annotationTool.selectedImageId);
	//const shapes = useSelector((state: any) => state.annotationTool.shapes);
	//const images = useSelector((state: any) => state.annotationTool.images);
	const shapes: any[] = [];
	const [ images, setImages] = useState<any[]>([]);
	//const dispatch = useDispatch();

	const selectedImage = useMemo(() => {
		console.log(images, selectedImageId)
		return images.find((image: any) => image.id === selectedImageId);
	}, [selectedImageId]);
	const selectedImageIdx = useMemo(() => images.findIndex((image: any) => image.id === selectedImageId), [images, selectedImageId]);

	const handleFileSelect = (files: File[]) => {
		setImages(() => {
			const newImages =  Object.values(files).map((file: File) => ({ id: file.name, name: file.name, url: URL.createObjectURL(file) }));
			// TODO: REMOVE THE createObjectURL MEMORY LEAK
			setSelectedImageId(newImages[0].id);
			return newImages;
		});
	}

	useEffect(() => {
		const handleTabClose = (e: any) => {
			e.preventDefault();
			console.log("saving: ", saving);
			if (saving) {
				return (e.returnValue = 'Are you sure you want to exit?');
			}
			else {
				return true;
			}
		};
	
		window.addEventListener('beforeunload', handleTabClose);
	
		return () => {
			window.removeEventListener('beforeunload', handleTabClose);
		};
	}, [saving]);
	
	const deleteShapeById = (id: number) => {
		//save
		//dispatch(setShapes(shapes.filter((shape: any) => shape.id !== id)));
		setSaving(true);
	}

	useEffect(() => {
		if (selectedImageId && saving) {

			const data = {
				image_id: selectedImageId,
				boxes: shapes.map((shape: any) => shape.getBboxObject())
			}

			let cancel: any;
			const cancelToken = new axios.CancelToken(c => cancel = c);			
			/*saveAnnotations(data, cancelToken)
			.then(res => {
				console.log("Successfully saved image annoations", res);*/
				/*dispatch(setImagesList(images.map((image: any) => {
					if (image.id === selectedImageId) {
						return {...image, boxes: [...data.boxes]};
					}

					return image;
				})))*/

			/*	setSaving(false);
			})
			.catch(err => {
				console.log("Error saving image annotations", err);
				setSaving(false);
			})*/

			
			return () => {
				console.log("canceling annotation saving");
				//setSaving(false);
				cancel();
			}
		}
	}, [shapes]);

	// Handle key press
	useEffect(() => {
		const keyDownHandler = (event: any) => {
		  console.log('User pressed: ', event.key);
	
		  // go to next image
		  if (event.key.toUpperCase() === 'D') {
			event.preventDefault();
			if (images.length > selectedImageIdx + 1) {
				//dispatch(setSelectedImageId(images[selectedImageIdx + 1].id));
			}
		  }
		  // go to previous image
		  else if (event.key.toUpperCase() === 'Q'){
			event.preventDefault();
			if ((selectedImageIdx > 0) && (images.length > selectedImageIdx - 1)) {
				//dispatch(setSelectedImageId(images[selectedImageIdx - 1].id));
			}
		  }
		  else if (event.key.toUpperCase() === 'W') {
			mode === "create" ? setMode("select") : setMode("create")
		  }
		};
	
		document.addEventListener('keydown', keyDownHandler);
	
		return () => {
		  document.removeEventListener('keydown', keyDownHandler);
		};
	}, [images, selectedImageIdx, mode]);


	return (
		<div className='annotation-tool'>
			<div className="annotation-tool-wrapper">
				<div className="top-control-bar">
					<FormControl fullWidth>
						<InputLabel id="class-select-label">Class</InputLabel>
						<Select
							labelId="class-select-label"
							id="class-select"
							value={activeLabelId}
							label="Class"
							onChange={(event: SelectChangeEvent<number>) => setActiveLabelId(event.target.value as number)}
							sx={{width: 250}}
						>
							{labels.map((label: string, index: number) => (
								<MenuItem key={index} value={index}>{label}</MenuItem>
							))}
						</Select>
					</FormControl>
				</div>
				<div className="row-2">
					<div className='side-control-bar-left'>
						<div className="side-control-bar-buttons">
							<button onClick={e => setMode("create")} className="btn btn-primary"><TbRectangle /></button>
							<button onClick={e => setMode("select")} className="btn btn-primary"><FaArrowsAlt /></button>
						</div>
					</div>
					<div className="canvas-wrapper">
						<div className='annotation-tool-canvas'>
							{ (images.length === 0) 
								? 
									<div className="canvas-placeholder">
										<img src={genericImageIcon} width={200}></img>
										<FileUploadButton onFileUpload={handleFileSelect}>Import Dataset</FileUploadButton>
									</div>
								:
									<AnnotationCanvas
										image={selectedImage}
										mode={mode}
										activeLabelId={activeLabelId}
										setSaving={setSaving}
										background={background}
									/>
							}
						</div>
					</div>
					<div>
						{shapes.map((shape: any) => 
							<ShapeController
								key={shape.id}
								shape={shape}
								background={background}
								labels={labels}
								deleteShapeById={deleteShapeById}
							/>)
						}
					</div>
				</div>
				{/*<ImagesBand 
					selectedImageId={selectedImageId}
					setLoading={setInitialLoading}
					setError={setInitialError}
					segmentId={segmentId}
					page={page}
					setPage={setPage}
					/>*/}
			</div>
		</div>
	)
}

export default AnnotationTool