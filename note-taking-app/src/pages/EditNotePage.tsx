import * as React from "react";
import {Box,Button,Paper,TextField,Typography,Stack,} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import {useGetNoteByIdQuery,useUpdateNoteMutation,} from "../services/noteApi";

interface NoteFormState {
  title: string;
  description: string;
  priority: string;
  assignee: string;
  category: string;
  task:string;
  startDate: string;
  endDate: string;
}
const formatDateForInput = (dateStr: string | undefined): string => {
  if (!dateStr) return "";
  const cleanDate = dateStr.includes(" ") ? dateStr.split(" ")[0] : dateStr.split("T")[0];
  return cleanDate;
};

export const EditNotePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading ,isError} = useGetNoteByIdQuery(id!,{skip:!id,});
  const [updateNote] = useUpdateNoteMutation();

  const [form, setForm] = React.useState<NoteFormState>({
    title: "",
    description: "",
    priority: "",
    assignee: "",
    category: "",
    task:"",
    startDate: "",
    endDate: "",
  });


  React.useEffect(() => {
    if (data) {
      setForm({
        title: data.title || "",
        description: data.description ||data.content || "",
        priority: data.priority || "",
        assignee: data.assignee || "",
        category: data.category || "",
        task: data.task || "",
        // startDate: data.startDate || "",
        // endDate: data.endDate || "",
        startDate: formatDateForInput(data.startDate),
        endDate: formatDateForInput(data.endDate),
      });
    }
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>):void => {
    setForm((prev) => ({...prev,[e.target.name]: e.target.value,}
    ));
  };

  const handleSubmit = async () : Promise<void> => {
    if (!id) return;
    try {
      const payload = {
        ...form,
        content : form.description
      };
      await updateNote({id,body: payload,}).unwrap();

      navigate("/note-form"); 
    } catch (err) {
      console.log("Update failed", err);
    }
  };

  if (isLoading) return <Typography>Loading...</Typography>;
  if (isError) return <Typography color="error" sx={{ p: 3 }}>Error loading note data.</Typography>;
  return (
    <Paper sx={{ p: 3, maxWidth: 600, mx: "auto", mt: 4 ,width:'100%'}}>
      <Box sx={{display:"flex",justifyContent:'center',alignItems:'center'}}>
        <Typography variant="h6" sx={{mb:2}}>
        Edit Note
      </Typography>
      </Box>

      <Stack spacing={2}>
        <TextField
          label="Title"
          name="title"
          value={form.title}
          onChange={handleChange}
        />

        <TextField
          label="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
        />

        <TextField
          label="Priority"
          name="priority"
          value={form.priority}
          onChange={handleChange}
        />

        <TextField
          label="Assignee"
          name="assignee"
          value={form.assignee}
          onChange={handleChange}
        />

        <TextField
          label="Category"
          name="category"
          value={form.category}
          onChange={handleChange}
        />
         <TextField
          label="Task Action"
          name="task"
          value={form.task}
          onChange={handleChange}
        />

        <TextField
          label="Start Date"
          name="startDate"
          type="date"
          
          value={form.startDate}
          onChange={handleChange}
          slotProps={{inputLabel:{shrink:true},}} 
        />

        <TextField
          label="End Date"
          name="endDate"
          type="date"
          value={form.endDate}
          onChange={handleChange}
          slotProps={{inputLabel:{shrink:true},}} 
        />

        <Box sx={{display:'flex',gap:2,justifyContent:"center",alignItems:"center"}}>
          <Button variant="contained" onClick={handleSubmit}>
            Update
          </Button>

          <Button variant="outlined" sx={{color:'black'}} onClick={() => navigate("/note-form")}>
            Cancel
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
};