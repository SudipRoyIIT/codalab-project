import React from "react";
import { Box, Typography, Link, Grid } from "@mui/material";
const Profile = () => {
  return (
    <>
      <Box
        sx={{
          width: "76%",
          height: "120px",
          padding: "2%",
          borderRadius: "30px",
          position: "relative",
          background: "skyblue",
          backgroundPosition: "center",

          marginTop: "1%",
          marginLeft: "23%",
        }}
      >
        <Box
          sx={{
            width: "12%",
            height: "7%",
            borderRadius: "50%",
            position: "relative",
            right: "1%",
            bottom: "1%",
          }}
        />
      </Box>
      <Box
        component="img"
        loading="lazy"
        sx={{
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          position: "relative",
          bottom: "1%",
          right: 0,
          backgroundImage:
            "url(https://faculty.iitr.ac.in/~sudiproy.fcs/web_files/SudipRoy2022.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          marginLeft: "29%",
          boxShadow: "0 -12px 1px #ffffff",
        }}
      />
      <Box
        sx={{
          top: "-140px",
          position: "relative",
          right: "-40%",
          width: "64%",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            mt: 6,
            fontFamily: "Abhaya Libre ExtraBold",
            fontWeight: "bold",
          }}
        >
          Dr. Sudip Roy (সুদীপ রায়)
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            mt: 1,
            fontFamily: "Abhaya Libre ExtraBold",
            fontSize: "1.2rem",
          }}
        >
          Associate Professor, Department Of Computer Science And Engineering
        </Typography>
        <Typography
          variant="subtitle2"
          sx={{
            mt: 1,
            fontFamily: "Abhaya Libre ExtraBold",
            fontSize: "1.2rem",
          }}
        >
          Joint Faculty, Center Of Excellence In Disaster Mitigation And
          Management (CoEDMM)
        </Typography>
        <Typography
          variant="body2"
          sx={{
            mt: 1,
            fontFamily: "Abhaya Libre ExtraBold",
            fontSize: "1.2rem",
          }}
        >
          Indian Institute Of Technology (IIT) Roorkee
          <br />
          Roorkee 247667, Uttarakhand, India
        </Typography>
        <Grid container spacing={1} sx={{ mt: 1 }}>
          <Grid item>
            <Link
              href="https://faculty.iitr.ac.in/~sudiproy.fcs/web_files/Sudip_Roy_CV_Aug_2023.pdf"
              target="_blank"
            >
              <img
                loading="lazy"
                src="https://seeklogo.com/images/A/Adobe_Reader-logo-49DD908156-seeklogo.com.png"
                alt="Adobe"
                style={{ width: 40, height: 40 }}
              />
            </Link>
          </Grid>
          <Grid item>
            <Link
              href="https://faculty.iitr.ac.in/~sudiproy.fcs/web_files/Sudip_Roy_CV_Aug_2023.pdf"
              target="_blank"
            >
              <img
                loading="lazy"
                src="https://cdn.iconscout.com/icon/free/png-256/free-dblp-3521374-2944818.png?f=webp"
                alt="DBLP"
                style={{ width: 40, height: 40 }}
              />
            </Link>
          </Grid>
          <Grid item>
            <Link
              href="https://scholar.google.co.in/citations?user=Sl3l41YAAAAJ&hl=en"
              target="_blank"
            >
              <img
                loading="lazy"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Google_Scholar_logo.svg/2048px-Google_Scholar_logo.svg.png"
                alt="Google Scholar"
                style={{ width: 40, height: 40 }}
              />
            </Link>
          </Grid>
          <Grid item>
            <Link
              href="https://www.researchgate.net/profile/Sudip_Roy5?ev=hdr_xprf"
              target="_blank"
            >
              <img
                loading="lazy"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnMssA1OEn-_jyUTEuqzS4JNIPL9Pyp0EZUw&s"
                alt="ResearchGate"
                style={{ width: 40, height: 40 }}
              />
            </Link>
          </Grid>

          <Grid item>
            <Link href="https://orcid.org/0000-0001-7873-3069" target="_blank">
              <img
                loading="lazy"
                src="https://tse1.mm.bing.net/th?id=OIP.MlIMlCWCg3JsAPFaRsyXVgHaHa&pid=Api&P=0&h=220"
                alt="Orcid"
                style={{ width: 40, height: 40 }}
              />
            </Link>
          </Grid>

          <Grid item>
            <Link
              href="https://www.linkedin.com/in/sudipr007?trk=nav_responsive_tab_profile"
              target="_blank"
            >
              <img
                loading="lazy"
                src="https://t3.ftcdn.net/jpg/04/37/88/86/360_F_437888641_XrjjuAwATXWNx10jQurCDaXXJnobhDi4.jpg"
                alt="LinkedIn"
                style={{ width: 40, height: 40 }}
              />
            </Link>
          </Grid>
          <Grid item>
            <Link href="mailto:sudip.roy@cs.iitr.ac.in">
              <img
                loading="lazy"
                src="https://i.pinimg.com/736x/88/e1/4c/88e14cc7e7fcbb0e0e09de26cec86c61.jpg"
                alt="Gmail"
                style={{ width: 40, height: 40 }}
              />
            </Link>
          </Grid>
          <Grid item>
            <Link
              href="https://www.youtube.com/channel/UCWw3N2Ua4qCRTOPmm1YM9hQ"
              target="_blank"
            >
              <img
                loading="lazy"
                src="https://t3.ftcdn.net/jpg/04/74/05/94/360_F_474059464_qldYuzxaUWEwNTtYBJ44VN89ARuFktHW.jpg"
                alt="YouTube"
                style={{ width: 40, height: 40 }}
              />
            </Link>
          </Grid>
          <Grid item>
            <Link href="https://www.facebook.com/sudiproy.bkp" target="_blank">
              <img
                loading="lazy"
                src="https://www.facebook.com/images/fb_icon_325x325.png"
                alt="Facebook"
                style={{ width: 40, height: 40 }}
              />
            </Link>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};
export default Profile;
