import { styled } from "@mui/material/styles";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import React from "react";
import MuiAccordionSummary, { AccordionSummaryProps } from "@mui/material/AccordionSummary";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordionDetails from "@mui/material/AccordionDetails";

export const Accordion = styled((props: AccordionProps) => <MuiAccordion disableGutters elevation={0} square {...props} />)(({ theme }) => ({
	border: `1px solid ${theme.palette.divider}`,
	"&:not(:last-child)": {
		borderBottom: 0,
	},
	"&:before": {
		display: "none",
	},
}));

export const AccordionSummary = styled((props: AccordionSummaryProps) => <MuiAccordionSummary expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />} {...props} />)(
	({ theme }) => ({
		flexDirection: "row-reverse",
		"& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
			transform: "rotate(90deg)",
		},
		"& .MuiAccordionSummary-content": {
			marginLeft: theme.spacing(1),
		},
	})
);

export const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
	padding: theme.spacing(2),
	borderTop: "1px solid rgba(0, 0, 0, .125)",
	backgroundColor: theme.palette.background.default,
}));
