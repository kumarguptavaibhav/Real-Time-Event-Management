import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

function ModalView({ data, modalView, handleModalClose }) {
  return (
    <Modal
      open={modalView}
      onClose={handleModalClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 'auto',
          bgcolor: "white",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography fontSize={"1.5rem"} fontWeight={600}>
          Event Detail
        </Typography>
        <Typography sx={{ mt: 2, color: '#f72585' }}>
          {`Event Name: ${data?.event_name}`}
        </Typography>
        <Typography sx={{ mt: 2, color: '#b5179e' }}>
          {`Event Type: ${data?.event_type}`}
        </Typography>
        <Typography sx={{ mt: 2, color: '#7209b7' }}>
          {`Event Level: ${data?.event_level}`}
        </Typography>
        <Typography sx={{ mt: 2, color: '#560bad' }}>
          {`Event Organizers: ${data?.event_organizers}`}
        </Typography>
        <Typography sx={{ mt: 2, color: '#780000' }}>
          {`Event Description: ${data?.event_description}`}
        </Typography>
        <Typography sx={{ mt: 2, color: '#c1121f' }}>
          {`Organization Name: ${data?.organization_name}`}
        </Typography>
        <Typography sx={{ mt: 2, color: '#5f0f40' }}>
          {`External Organizers: ${data?.external_organizers}`}
        </Typography>
        <Typography sx={{ mt: 2, color: '#fb8b24' }}>
          {`Speaker Name: ${data?.speaker_name}`}
        </Typography>
        <Typography sx={{ mt: 2, color: '#e36414' }}>
          {`Speaker Type: ${data?.speaker_type}`}
        </Typography>
        <Typography sx={{ mt: 2, color: '#386641' }}>
          {`Chief Guest Name: ${data?.chief_guest_name}`}
        </Typography>
        <Typography sx={{ mt: 2, color: '#6a994e' }}>
          {`Chief Guest Designation: ${data?.chief_guest_designation}`}
        </Typography>
        <Typography sx={{ mt: 2, color: '#05668d' }}>
          {`Start Date: ${data?.start_date}`}
        </Typography>
        <Typography sx={{ mt: 2, color: '#00a896' }}>{`End Date: ${data?.end_date}`}</Typography>
      </Box>
    </Modal>
  );
}
export default ModalView;
