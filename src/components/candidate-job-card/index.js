"use client";

import { Fragment, useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  LogInWithAnonAadhaar,
  useAnonAadhaar,
  AnonAadhaarProof,
  AnonAadhaarProvider,
} from "@anon-aadhaar/react";
import CommonCard from "../common-card";
import JobIcon from "../job-icon";
import { Button } from "../ui/button";
import { createJobApplicationAction } from "@/actions";
import { useToast } from "../ui/use-toast";
import { useProver } from "@anon-aadhaar/react";
import { useRef } from "react";

function CandidateJobCard({ jobItem, profileInfo, jobApplications }) {
  const audioRef = useRef(null);

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const [showJobDetailsDrawer, setShowJobDetailsDrawer] = useState(false);
  console.log(jobApplications, "jobApplications");
  const { toast } = useToast();
  const [anonAadhaar] = useAnonAadhaar();
  const [, latestProof] = useProver();
  async function handlejobApply() {
    if (anonAadhaar?.status !== "logged-in") {
      toast({
        variant: "destructive",
        title: "Please login with Aadhaar",
      });
      return;
    }
    if (!profileInfo?.isPremiumUser && jobApplications.length >= 2) {
      setShowJobDetailsDrawer(false);
      toast({
        variant: "destructive",
        title: "You can apply max 2 jobs.",
        description: "Please opt for membership to apply for more jobs",
      });
      return;
    }

    await createJobApplicationAction(
      {
        recruiterUserID: jobItem?.recruiterId,
        name: profileInfo?.candidateInfo?.name,
        email: profileInfo?.email,
        candidateUserID: profileInfo?.userId,
        status: ["Applied"],
        jobID: jobItem?._id,
        jobAppliedDate: new Date().toLocaleDateString(),
      },
      "/jobs"
    );
    setShowJobDetailsDrawer(false);
  }

  return (
    <Fragment>
      <Drawer
        open={showJobDetailsDrawer}
        onOpenChange={setShowJobDetailsDrawer}
      >
        <CommonCard
          icon={<JobIcon />}
          title={jobItem?.title}
          description={jobItem?.companyName}
          footerContent={
            <Button
              onClick={() => setShowJobDetailsDrawer(true)}
              className=" dark:bg-[#fffa27] flex h-11 items-center justify-center px-5"
            >
              View Details
            </Button>
          }
        />
<DrawerContent className="flex flex-col rounded-t-[10px] h-full w-full px-6 py-8">
  <DrawerHeader className="px-0 mb-6">
    <div className="flex justify-center">
      <DrawerTitle className="text-4xl dark:text-white font-extrabold text-gray-800 text-center">
        {jobItem?.title}
      </DrawerTitle>
    </div>
  </DrawerHeader>
  <DrawerDescription className="text-2xl dark:text-white font-medium text-gray-600 mb-6 text-center">
    {jobItem?.description}
    <span className="text-xl dark:text-white ml-4 font-normal text-gray-500">
      {jobItem?.location}
    </span>
  </DrawerDescription>
  <div className="w-[150px] mb-6 mx-auto flex justify-center dark:bg-white items-center h-[40px] bg-black rounded-[4px]">
    <h2 className="text-xl font-bold dark:text-black text-white">
      {jobItem?.type} Time
    </h2>
  </div>
  <h3 className="text-2xl font-medium text-black mb-6 text-center">
    Experience: {jobItem?.experience} year
  </h3>
  <div className="flex flex-wrap gap-4 mb-8 justify-center">
    {jobItem?.skills.split(",").map((skillItem) => (
      <div key={skillItem} className="w-[100px] flex justify-center items-center h-[35px] dark:bg-white bg-black rounded-[4px]">
        <h2 className="text-[13px] font-medium text-white dark:text-black">
          {skillItem}
        </h2>
      </div>
    ))}
  </div>
  <div className="flex justify-center gap-6 mt-8">
    <LogInWithAnonAadhaar
      nullifierSeed={1234}
      fieldsToReveal={[
        "revealAgeAbove18",
        "revealGender",
        "revealState",
        "revealPinCode",
      ]}
    />
    <Button
      onClick={handlejobApply && handlePlay}
      disabled={
        jobApplications.findIndex(
          (item) => item.jobID === jobItem?._id
        ) > -1
          ? true
          : false
      }
      className="disabled:opacity-65 flex h-11 items-center justify-center px-5"
    >
      {jobApplications.findIndex(
        (item) => item.jobID === jobItem?._id
      ) > -1
        ? "Applied"
        : "Apply"}
    </Button>
    <audio ref={audioRef} src="/Microsoft.webm" />
    <Button
      className="flex h-11 items-center justify-center px-5"
      onClick={() => setShowJobDetailsDrawer(false)}
    >
      Cancel
    </Button>
  </div>
</DrawerContent>

      </Drawer>
    </Fragment>
  );
}

export default CandidateJobCard;
