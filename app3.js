///**
// * Created by tuananh on 12/29/15.
// */
//'use strict';
//
////job_link (2)
////title (3)
////locations (4)
////source (5)
////skills (7)
////expriry_date (9)
////content (10)
////requirement (11)
////logo_company_url (13)
////job_company_info (14)
//const cheerio = require('cheerio');
//const promise = require('bluebird');
//const request = require('request');
//const requestPromise = require('request-promise');
//const fs = require('fs');
//var Crawler = require("crawler");
//const url = require('url');
//var mmm = require('mmmagic'),
//    Magic = mmm.Magic;
//let job_des = [];
//let source = "https://www.careerlink.vn";
//let baseLink = "https://www.careerlink.vn/viec-lam/cntt-phan-mem/19?page=";
//let img_Path = __dirname+'/img_job/';
//let rp = require('request-promise');
//
//function crawlPage(numpage){
//    return new Promise(function(fulfill,reject){
//        let ic = new Crawler({
//            jQuery : true,
//            callback : function(err,result,$){
//                let title = '',job_link = '',location = '';
//                let i = 0;
//                $('.list-group-item').each(function(index,elem){
//                    let link = $(elem).find(".list-group-item-heading a").attr('href');
//                    let location = $(elem).find('.priority-data a:last-child').text();
//                    if(link != undefined){
//                        job_des.push({
//                            link : source+link,
//                            location : location
//                        })
//                    }
//                    fulfill(job_des);
//                })
//            }
//        })
//        if(numpage>1){
//            for (var i = 1 ; i<numberpage;i++){
//                ic.queue(baseLink+i);
//            }
//        }else{
//            ic.queue(baseLink+numpage);
//        }
//    })
//}
//
//function getContentWeb(item){
//    let link = item.link;
//    let location = item.location;
//    return new Promise(function(fulfill,reject){
//        let ic = new Crawler();
//        ic.queue({
//            uri : link,
//            jQuery:true,
//            callback : function(error,result,$){
//                if(error) reject(error);
//                let salary = $('.critical-job-data li:last-child').text();
//                let job_title = $('.job-header').text();
//                let company_name = $('.critical-job-data li:first-child').text().replace(/\n/g,'');
//                let company_address = $('.critical-job-data li:nth-child(2)').text().replace(/\n/g,'');
//                let company_description = $('.job-side-data').find('div').text().replace(/\n/g,'');
//                let job_company_info = ({
//                    company_name : company_name,
//                    company_address : company_address,
//                    company_description : company_description,
//                });
//                let expiry_date = $('.job-data dl').find('dd').eq(1).text();
//                let content  = $('.job-data').children('div').eq(1).text();
//                let bonus = $('.job-data').children('ul').eq(1);
//                let img_src = $('.job-side-data').find('.text-center img').attr('src');
//                let requirement = $('.job-data').children('div').eq(2).text();
//                bonus.find('a').attr('href','');
//                //console.log(bonus.html());
//                requirement = '<p>'+requirement+'</p>'+'<ul>'+bonus.html()+'</ul>';
//                if(img_src != undefined){
//                    let data = ({ // tạo đối tượng để add vào database
//                        job_link : link,
//                        title : job_title,
//                        location: location,
//                        source : source,
//                        expiryDate: expiry_date,
//                        content : content,
//                        salary : salary,
//                        requirement : requirement,
//                        logo_company_url : source+img_src,
//                        job_company_info: job_company_info
//                    })
//                    fulfill(data);
//                    //console.log(data);
//                }else{
//                    let data = ({
//                        job_link : link,
//                        title : job_title,
//                        location: location,
//                        source : source,
//                        expiryDate: expiry_date,
//                        content : content,
//                        salary : salary,
//                        requirement : requirement,
//                        logo_company_url : '',
//                        job_company_info: job_company_info
//                    })
//                    fulfill(data);
//                    //console.log(data);
//                }
//            }
//        })
//    })
//    //let ic = new Crawler();
//    //ic.queue({
//    //    uri : link,
//    //    jQuery:true,
//    //    callback : function(error,result,$){
//    //        if(error) reject(error);
//    //        let salary = $('.critical-job-data li:last-child').text();
//    //        let job_title = $('.job-header').text();
//    //        let company_name = $('.critical-job-data li:first-child').text().replace(/\n/g,'');
//    //        let company_address = $('.critical-job-data li:nth-child(2)').text().replace(/\n/g,'');
//    //        let company_description = $('.job-side-data').find('div').text().replace(/\n/g,'');
//    //        let job_company_info = ({
//    //            company_name : company_name,
//    //            company_address : company_address,
//    //            company_description : company_description,
//    //        });
//    //        let expiry_date = $('.job-data dl').find('dd').eq(1).text();
//    //        let content  = $('.job-data').children('div').eq(2).text();
//    //        let bonus = $('.job-data').children('ul').eq(1);
//    //        let img_src = $('.job-side-data').find('.text-center img').attr('src');
//    //        let requirement = $('.job-data').children('div').eq(2).text();
//    //        bonus.find('a').attr('href','');
//    //        //console.log(bonus.html());
//    //        requirement = '<p>'+requirement+'</p>'+'<ul>'+bonus.html()+'</ul>';
//    //        if(img_src != undefined){
//    //            let data = ({
//    //                job_link : link,
//    //                title : job_title,
//    //                location: location,
//    //                source : source,
//    //                expiryDate: expiry_date,
//    //                content : content,
//    //                requirement : requirement,
//    //                logo_company_url : img_src,
//    //                job_company_info: job_company_info
//    //            })
//    //        }else{
//    //            let data = ({
//    //                job_link : link,
//    //                title : job_title,
//    //                location: location,
//    //                source : source,
//    //                expiryDate: expiry_date,
//    //                content : content,
//    //                requirement : requirement,
//    //                logo_company_url : '',
//    //                job_company_info: job_company_info
//    //            })
//    //        }
//    //        fulfill(data);
//    //    }
//    //})
//}
//
//function download(data){
//    return new Promise(function(fulfill,reject){
//
//        if(data.logo_company_url !=''){
//            var link  = {
//                uri : data.logo_company_url,
//                resolveWithFullResponse : true,
//            };
//            rp(link).then(function(response,html){
//                let ext = response.headers['content-type'].split('/').pop();
//                return ext;
//            }).then(function(ext){
//                request.get(data.logo_company_url)
//                    .on('err',function(err){
//                        reject(err);
//                    })
//                    .pipe(fs.createWriteStream(img_Path+data.job_company_info.company_name+'.'+ext))
//                    .on('finish',function(){
//                        console.log(data.job_company_info.company_name+' has been downloaded!!');
//                    })
//                    .on('err',function(err){
//                        reject(err);
//                    })
//            })
//        }
//    })
//}
//
//
//crawlPage(1).then(function(arr){
//    promise.map(arr,function(val,temp){
//        getContentWeb(val).then(function(data){
//            download(data);
//            console.log(data);
//        })
//    })
//})

var db = require('./db');

db['job'] = db.import(__dirname+'/job.js');

db.sync().then(function(){

});