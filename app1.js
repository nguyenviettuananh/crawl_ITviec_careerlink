/**
 * Created by tuananh on 12/26/15.
 */
'use strict';
const cheerio = require('cheerio');
const promise = require('bluebird');
const request = require('request');
const requestPromise = require('request-promise');
const fs = require('fs');
var Crawler = require("crawler");
const url = require('url');
let Download = require('download');
let job_des = [];
var baseLink = 'https://itviec.com?page=';
var source = 'IT Việc';
var exists = promise.promisify(fs.exists);
let winston = require('winston');

let logger = new (winston.Logger)({
    transports : [
        new (winston.transports.File)({ filename : __dirname+'/log/itviec.log' })
    ]
});

function crawlPage(numberpage){
    return new Promise(function(fulfill,reject){
        let ic = new Crawler({
            jQuery : true,
            callback : function(error,result,$){
                let title = '',job_link = '',location = '';
                $('.job').each(function(index,elem){
                    let link = $(elem).find('.title a').attr('href');
                    job_link = (baseLink.split('?'))[0]+link;
                    title = $(elem).find('.title a').text();
                    let location = $('.city').eq(index).find('.text').eq(0).text();
                    //console.log(title);
                    job_des.push({link : job_link,location : location});
                    fulfill(job_des);
                })
            }
        });
        if(numberpage>1){
            for (var i = 1 ; i<numberpage;i++){
                ic.queue(baseLink+i);
            }
        }else{
            ic.queue(baseLink+numberpage);
        }
    })
}


function getContentWeb(item){
    let job_link = item.link;
    let location = item.location;
    return new Promise(function(fulfill,reject){
        if(job_link != ''){
            let ic = new Crawler();
            ic.queue({
                uri : job_link,
                jQuery : true,
                callback : function(error,result,$){
                    if(error)  reject(error);
                    let name = $('.name').text();
                    let job_title = $('.job_title').text();
                    let salary = $('.salary span:last-child').html();
                    let tagList = $('.tag-list').find('.tag-content a');
                    let address = $('.address').text();
                    let arrText = [];
                    let arrTag = [];
                    tagList.each(function(){
                        let tag = $(this).text();
                        arrText.push(tag);
                    })
                    let arrLength = arrText.length;
                    for (let i = 0; i < arrLength; i++) {
                        for (let t = i + 1; t < arrLength; t++) {
                            while (arrText[i] == arrText[t]) {
                                for (let j = i; j < arrLength; j++)
                                    arrText[j] = arrText[j + 1];
                                arrLength--;
                            }
                        }
                    }
                    for (let i = 0; i < arrText.length; i++) {
                        if (arrText[i] != undefined) {
                            arrTag.push(arrText[i]);
                        }
                    }
                    //console.log(arrTag);
                    let expiredDate = $('.created_at').text();
                    let description = $('.description').text();
                    let skill_experience = $('.experience').text();
                    let company_url = $('.logo a').attr('href');
                    let img_src = $('.logo a img').attr('src');
                    let d = new Date();
                    let data = {
                        company : name, //tên công ty
                        job_link : job_link, //link crawl
                        title : job_title, // tên nội dung công việc
                        address : address.split("\n")[0], // địa chỉ công ty
                        source : source,
                        salary : salary, // Lương
                        tag : arrTag, // tag
                        crawl_date : d.toLocaleTimeString() +' thứ '+ (d.getDate()+1) +' tháng '+(d.getMonth()+1) + 'năm '+ d.getFullYear(), // ngày crawl
                        expiryDate : expiredDate, // ngày hết hạn đăng kí
                        content : description, // nội dung tuyển dụng
                        requirement : skill_experience, // yêu cầu tuyển dụng
                        company_url : (baseLink.split('?'))[0]+company_url, // link công ty
                        logo : (baseLink.split('?'))[0]+img_src, // link logo
                    }
                    fulfill(data);
                }
            })
        }
    })
}

function download(data){
    return new Promise(function(fulfill,reject){
       let ext = url.parse(data.logo).pathname.split('/').pop().split('.').pop();
        request.get(data.logo)
        .on('error',function(err){
                reject(err);
            })
        .pipe(fs.createWriteStream(__dirname+'/img_job/'+data.company+'.'+ext))
        .on('finish',function(){
                console.log("downloaded "+data.company+" !!");
                fulfill(data);
            })
        .on('error',function(err){
                reject(err);
            })
    })
}

function getCompanyInfo(data){
    return new Promise(function(fulfill,reject){
        let ic = new Crawler();
        let job_company_info ='';
        ic.queue({
            uri : data.company_url,
            jQuery : true,
            callback : function(err,result,$){
                if(err) reject(err);
                let short_description = $('.short-description').text();
                let about_us = $('.about-us').text();
                let top_3_reason = $('.top-3-reasons').text();
                let description = '<p>'+short_description+'</p>'+'<p>'+about_us+'</p>'+'<p>'+top_3_reason+'</p>';
                job_company_info = {
                    company_name : data.company,
                    company_address : data.address,
                    company_description : description
                }
                data['job_company.info'] = job_company_info;
                fulfill(data);
            }
        })
    })
}
var count = 0;
crawlPage(2).then(function(arr){
    promise.map(arr,function(val){
        setTimeout(function(count){
            getContentWeb(val)
                .then(function(data){
                    getCompanyInfo(data)
                        .then(function(data){
                            download(data).then(function(data){
                                logger.log('info','Completely crawling a job !!!')
                            })
                        })
                })
            .catch(function(e){
                    logger.log('error','Error : ' + e.message);
                })
        },count*7000,count);
        count++;
    })
})