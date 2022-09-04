import { ArrowLeft } from "@mui/icons-material";
import {
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Link,
  Typography,
} from "@mui/material";
import { Box, Container, Stack } from "@mui/system";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import ImageGallery from "react-image-gallery";
import data from "../data/response.json";

export default function Product() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [selectedColor, setColor] = useState(null);
  const [selectedStorage, setStorage] = useState(null);

  const colors = [...new Set(products.map((i) => i.mColor))];
  const storage = [...new Set(products.map((i) => i.internalMemory))];

  useEffect(() => {
    if (router.query.id) {
      setProducts(
        data.skus.filter((sku) => sku.displayGroup === router.query.id)
      );
    }
  }, [router]);

  return (
    <Container maxWidth="lg">
    <Button startIcon={<ArrowLeft/>} onClick={()=>{router.back()}}>Back</Button>
      <Grid container direction="row">
        <Grid item lg={6}>
          <ImageGallery
            items={
              selectedColor
                ? getImages(
                    products.find((x) => x.mColor === selectedColor)
                      ?.mLargeImage,
                    products.find((x) => x.mColor === selectedColor)
                      ?.mAlternateImages
                  )
                : getImages(
                    products[0]?.mLargeImage,
                    products[0]?.mAlternateImages
                  )
            }
          />
        </Grid>
        <Grid item lg={6}>
          <Stack spacing={2} sx={{ margin: 2 }}>
            <Grid container>
              <Grid item xs={12} sm={12} lg={8}>
                <Typography fontWeight="bold" fontSize={20}>
                  {products[0]?.mName}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={12} lg={4}>
                <Typography fontWeight="bold" fontSize={20}>
                  $
                  {selectedColor && selectedStorage
                    ? products.find(
                        (p) =>
                          p.mColor === selectedColor &&
                          p.internalMemory === selectedStorage
                      )?.mAttNextPricing[0]?.termBasePrice
                    : products[0]?.mAttNextPricing[0]?.termBasePrice}
                  /mo.
                </Typography>
                <Typography color="GrayText" fontSize={11}>
                  Retail Price: $
                  {selectedColor && selectedStorage
                    ? products.find(
                        (p) =>
                          p.mColor === selectedColor &&
                          p.internalMemory === selectedStorage
                      )?.mPrice
                    : products[0]?.mPrice}
                </Typography>
              </Grid>
            </Grid>
            <Typography>{products[0]?.mDescription}</Typography>
            <Container>
              {products[0]?.taxoCategories.taxoFeatures?.map((f) => (
                <Chip key={f.Key} label={f.displayName} sx={{ margin: 1 }} />
              ))}
            </Container>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: "flex" }}>
                  <Typography fontWeight="bold" sx={{ marginRight: 2 }}>
                    Color:
                  </Typography>
                  <Typography>{selectedColor}</Typography>
                </Box>
                {colors.map((i) => (
                  <Button
                    variant="outlined"
                    sx={{ margin: 1 }}
                    key={i}
                    onClick={() => {
                      setColor(i);
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: products.find((x) => x.mColor === i)
                          ?.mHtmlColor,
                        borderRadius: "50%",
                        height: 20,
                        width: 20,
                      }}
                    />
                  </Button>
                ))}
              </CardContent>
            </Card>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: "flex" }}>
                  <Typography fontWeight="bold" sx={{ marginRight: 2 }}>
                    Storage:
                  </Typography>
                  <Typography>
                    {selectedStorage}{" "}
                    {
                      products.find((x) => x.internalMemory === selectedStorage)
                        ?.internalMemoryUOM
                    }
                  </Typography>
                </Box>
                {storage.map((i) => (
                  <Button
                    sx={{ margin: 1 }}
                    variant="outlined"
                    key={i}
                    onClick={() => {
                      setStorage(i);
                    }}
                  >
                    {i}
                    {
                      products.find((x) => x.internalMemory === i)
                        .internalMemoryUOM
                    }
                  </Button>
                ))}
              </CardContent>
            </Card>
            {selectedStorage && selectedColor ? (
              <Card variant="outlined">
                <CardContent>
                  <Link
                    href={
                      products.find(
                        (x) =>
                          x.internalMemory === selectedStorage &&
                          x.mColor === selectedColor
                      )?.PDPPageURL
                    }
                  >
                    <Button fullWidth variant="contained">
                      Buy Now!
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : undefined}
          </Stack>
        </Grid>
      </Grid>
      {/* <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreOutlined />}>
            <Typography>Overview</Typography>
        </AccordionSummary>
        <AccordionDetails>
            <Typography>
                {products[0]?.mDescription}
            </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreOutlined />}>
            <Typography>Features</Typography>
        </AccordionSummary>
        <AccordionDetails>
            
        </AccordionDetails>
      </Accordion> */}
    </Container>
  );
}

function getImages(largeImage, mAlternateImages) {
  let images = [
    {
      original: `http:${largeImage}`,
      thumbnail: `http:${largeImage}`,
    },
  ];
  if (mAlternateImages) {
    mAlternateImages.split(",").map((i) => {
      if (i.substring(0, 2) === "//") {
        images.push({
          original: `http:${i}`,
          thumbnail: `http:${i}`,
        });
      }
    });
  }
  return images;
}
