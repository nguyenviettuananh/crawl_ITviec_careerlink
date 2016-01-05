/**
 * Created by tuananh on 12/26/15.
 **/
    'use strict';
const cheerio = require('cheerio');
const promise = require('bluebird');
const request = require('request');
const fs = require('fs');
const url = require('url');
var baseLink = 'https://itviec.com';
var link = 'https://itviec.com/jobs/javascript-angularjs-nodejs-node-js-javascript-developer';
request(link,function(err,response,html){
    var $ = cheerio.load(html);
    var job_title = $('.job_title').text();
    var company_name = $('.employer-info .name').text();
    var address = $('.job_info .address').text();
    var salary = $('.job_info .salary').text();
    //var tag_list = ($('.tag-content h2 a'))[0].children[0];
    var job_tag = [];
    var tag_list = $('.tag-content h2 a');
    for(var i = 0; i < tag_list.length/2;i++) {
        job_tag.push(tag_list[i].children[0].data)
    }
    var expiredDate = $('.created_at').text();
    var job_description = $('.job_description .description p').text();
    var skills_experience = $('.skills_experience .experience').text();
    var logo = $('.logo img').attr('src');
    //var ext = url.parse(baseLink + logo).pathname.split('/').pop().split('.').pop();
    //request.get(baseLink+logo)
    //    .on('error',function(err){
    //        console.log('Download error :', err);
    //    })
    //    .pipe(fs.createWriteStream(__dirname+'/img_job/'+company_name+'.'+ext))
    //    .on('finish',function(){
    //        console.log('Downloaded ' + company_name + '.' + ext);
    //    })
    //    .on('error',function(err){
    //        console.log("Error write to file", err);
    //    })
    var data = {
        job_title : job_title,
        company_name : company_name,
        address : address,
        salary : salary,
        job_tag : job_tag,
        job_des : job_description,
        experience : skills_experience,
    };
    //console.log(data);
    var href = $('.logo a').attr('href');
    request(baseLink+href,function(err,response,body){
        var $ = cheerio.load(body);
        var about = $('.about-us').text();
        data['about'] = about;
        //console.log(data);
    });

})
