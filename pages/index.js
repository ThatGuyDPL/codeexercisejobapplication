import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Rating,
  Toolbar,
  Typography,
} from "@mui/material";
import { Box, Container } from "@mui/system";
import FilterBar from "../components/filterbar";
import { useState } from "react";
import MultipleSelect from "../components/multiselect";
import { useRouter } from "next/router";

export default function StorePage() {
  const data = require("../data/response.json");
  const [keyword, setKeyword] = useState("");
  const [manufacturer, setManufacturer] = useState([]);
  const [feature, setFeature] = useState([]);
  const [os, setOs] = useState([]);

  let manufacturers = [];
  data.skus.forEach((sku) => {
    sku.taxoCategories?.taxoManu?.forEach((x) => {
      if (manufacturers.filter((e) => e.Key === x.Key).length === 0) {
        manufacturers.push(x);
      }
    });
  });

  let features = [];
  data.skus.forEach((sku) => {
    sku.taxoCategories?.taxoFeatures?.forEach((x) => {
      if (features.filter((e) => e.Key === x.Key).length === 0) {
        features.push(x);
      }
    });
  });

  let opsys = [];
  data.skus.forEach((sku) => {
    sku.taxoCategories?.taxoOperatingSystem?.forEach((x) => {
      if (opsys.filter((e) => e.Key === x.Key).length === 0) {
        opsys.push(x);
      }
    });
  });

  const displayGroups = [...new Set(data.skus.map((sku) => sku.displayGroup))];
  const products = displayGroups.map((id) =>
    data.skus
      .filter((sku) => {
        if (sku.displayGroup == id) {
          return sku;
        }
      })
      .map((sku) => sku)
  );
  const router = useRouter();
  return (
    <>
      <Container maxWidth="lg">
        <Toolbar />
        <FilterBar
          keyWordChange={(e) => {
            setKeyword(e);
          }}
        >
          <MultipleSelect
            onChange={(e) => {
              setManufacturer(
                typeof e.target.value === "string"
                  ? e.target.value.split(",")
                  : e.target.value
              );
            }}
            label="Manufacturer"
            value={manufacturer}
            options={manufacturers}
          />
          <MultipleSelect
            onChange={(e) => {
              setFeature(
                typeof e.target.value === "string"
                  ? e.target.value.split(",")
                  : e.target.value
              );
            }}
            label="Features"
            value={feature}
            options={features}
          />
          <MultipleSelect
            onChange={(e) => {
              setOs(
                typeof e.target.value === "string"
                  ? e.target.value.split(",")
                  : e.target.value
              );
            }}
            label="Operating System"
            value={os}
            options={opsys}
          />
        </FilterBar>
        <Grid
          direction="row"
          container
          spacing={2}
          justifyContent="center"
          sx={{ mt: 5 }}
        >
          {products
            .filter((sku) => {
              if (
                sku[0].mName.toLowerCase().includes(keyword.toLowerCase()) &&
                manufacturer.every((v) => sku[0].mCategories.includes(v)) &&
                feature.every((v) => sku[0].mCategories.includes(v)) &&
                os.every((v) => sku[0].mCategories.includes(v))
              ) {
                return sku;
              }
            })
            .map((sku) => {
              const {
                mDisplayContents,
                mName,
                mLargeImage,
                mStarRatings,
                mNumOfStarReviews,
                mAttNextPricing,
                paymentType,
                mPrice,
                displayGroup,
              } = sku[0];
              return (
                <Grid item xs={12} sm={6} md={4} key={displayGroup}>
                  <Card variant="outlined">
                    <Box sx={{ display: "flex", height: 200 }}>
                      <CardMedia
                        component="img"
                        image={`https:${mLargeImage}`}
                        sx={{ width: 200, padding: 2 }}
                      />
                      <CardContent sx={{ width: "100%", padding: 0 }}>
                        <Box
                          sx={{
                            backgroundColor: "#1655af",
                            padding: 1,
                            visibility:
                              mDisplayContents[0].mIsEnable === true
                                ? "visible"
                                : "hidden",
                          }}
                        >
                          <Typography color="white" fontSize={12}>
                            {mDisplayContents[0]?.mDescription}
                          </Typography>
                        </Box>
                        <Typography fontWeight="bold">{mName}</Typography>
                        <Box display="flex" alignContent="center">
                          <Rating
                            size="small"
                            name="read-only"
                            value={mStarRatings}
                            readOnly
                            precision={0.1}
                          />
                          <Typography
                            fontSize={10}
                          >{`(${mNumOfStarReviews})`}</Typography>
                        </Box>
                        {paymentType === "postpaid" ? (
                          <Box sx={{ display: "flex" }}>
                            <Typography
                              fontWeight="bold"
                              fontSize={24}
                              color="#f57224"
                            >
                              ${mAttNextPricing[0]?.termBasePrice}
                            </Typography>
                            <Typography color="#f57224">/mo</Typography>
                          </Box>
                        ) : undefined}
                        {paymentType === "prepaid" ? (
                          <Typography
                            fontWeight="bold"
                            fontSize={24}
                            color="#f57224"
                          >
                            {`$${Number(mPrice)}`}
                          </Typography>
                        ) : undefined}
                      </CardContent>
                    </Box>
                    <CardActions disableSpacing>
                      <Button
                        sx={{ marginLeft: "auto" }}
                        onClick={() => {
                          router.push(`/${displayGroup}`);
                        }}
                      >
                        See Details
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
        </Grid>
        <Toolbar />
      </Container>
    </>
  );
}